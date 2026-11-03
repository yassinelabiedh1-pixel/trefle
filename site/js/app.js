/* ============================================================
   Treffel Coffee House — rendu de la carte
   - bascule FR / EN et bascule de couleur (forêt / crème)
   - photo automatique par produit : images/produits/<nom-simplifié>
   - index collant qui suit le set en cours
   ============================================================ */

(function () {
  const index = document.getElementById("index");
  const main = document.getElementById("menu");
  const langBtn = document.getElementById("langToggle");
  const themeBtn = document.getElementById("themeToggle");

  let lang = localStorage.getItem("tf-lang") || "fr";
  const THEMES = ["bordeaux", "beige"];
  let theme = localStorage.getItem("tf-theme-ch");
  if (THEMES.indexOf(theme) < 0) theme = document.documentElement.dataset.theme || "bordeaux";

  // à augmenter quand des photos sont remplacées sous le même nom (vide le cache des téléphones)
  const IMG_V = "?v=2";
  const PHOTO_EXTS = ["webp", "jpg", "jpeg", "png"];
  const CLOVER = '<svg viewBox="0 0 1120.4 1118.89" aria-hidden="true"><use href="#clover"/></svg>';

  // "Bánh Mì Wrap" -> "banh-mi-wrap"
  function slugify(s) {
    return s
      .toLowerCase()
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  window.__tfSlugify = slugify;

  // Essaie l'extension suivante ; sinon retire l'image (le trèfle reste)
  window.__tfImgFallback = function (img) {
    if (img.dataset.fixed === "1") { img.remove(); return; }
    const next = Number(img.dataset.ext) + 1;
    if (next < PHOTO_EXTS.length) {
      img.dataset.ext = String(next);
      img.src = "images/produits/" + img.dataset.slug + "." + PHOTO_EXTS[next] + IMG_V;
    } else {
      img.remove();
    }
  };

  window.__tfImgLoaded = function (img) {
    img.closest(".dish-photo").classList.add("has-img");
  };

  // Vidéo : un produit avec video: "images/produits/x.mp4" la joue en boucle,
  // muette, par-dessus sa photo. Sans ce champ, seule la photo s'affiche.
  // iPhone : on n'attend pas les événements de chargement (Safari les retient) ;
  // on tente play() dès que le produit est à l'écran, et on juge sur le résultat.
  window.__tfVideoFail = function (src) {
    const video = src.closest("video");
    if (!video) return;
    if (video.dataset.fixed === "1" || src.nextElementSibling === null) { video.remove(); return; }
    src.remove();
    video.load();
  };

  function markVideo(video) {
    const box = video.closest(".dish-photo");
    if (box) box.classList.add("has-video");
  }

  function tryPlay(video) {
    if (!video.isConnected) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    const p = video.play();
    if (!p || !p.then) { markVideo(video); return; }
    p.then(function () {
      markVideo(video);
    }).catch(function (err) {
      // Pas de fichier (ou format illisible) : on retire la vidéo, la photo reste.
      if (err && err.name === "NotSupportedError") { video.remove(); return; }
      // Lecture refusée (mode économie d'énergie…) : on garde la photo, on réessaiera au toucher.
      video.dataset.retry = "1";
    });
  }

  function initVideos() {
    const videos = main.querySelectorAll(".dish-photo video");
    if (!videos.length) return;
    if (window.__tfVideoIO) window.__tfVideoIO.disconnect();
    if (!("IntersectionObserver" in window)) { videos.forEach(tryPlay); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) tryPlay(e.target);
        else if (!e.target.paused) e.target.pause();
      });
    }, { threshold: 0.2 });
    videos.forEach(function (v) { io.observe(v); });
    window.__tfVideoIO = io;
  }

  // Un toucher sur la page relance les vidéos refusées (économie d'énergie iOS)
  ["touchstart", "click"].forEach(function (ev) {
    document.addEventListener(ev, function () {
      main.querySelectorAll('.dish-photo video[data-retry="1"]').forEach(function (v) {
        delete v.dataset.retry;
        tryPlay(v);
      });
    }, { passive: true });
  });

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function photoHTML(item) {
    let src, attrs;
    if (item.photo) {
      src = item.photo;
      attrs = ' data-fixed="1"';
    } else {
      const slug = slugify(item.name.fr);
      src = "images/produits/" + slug + "." + PHOTO_EXTS[0];
      attrs = ' data-slug="' + slug + '" data-ext="0"';
    }
    // Vidéo uniquement si le produit en déclare une (video: "images/produits/x.mp4")
    let video = "";
    if (item.video) {
      video =
        '<video muted loop playsinline preload="metadata" data-fixed="1">' +
        '<source src="' + item.video + '" onerror="window.__tfVideoFail(this)" />' +
        "</video>";
    }
    return (
      '<div class="dish-photo">' +
      CLOVER +
      '<img src="' + src + IMG_V + '" alt="' + item.name[lang] + '" loading="lazy"' + attrs +
      ' onload="window.__tfImgLoaded(this)" onerror="window.__tfImgFallback(this)" />' +
      video +
      '<span class="stamp">' + CLOVER + "</span>" +
      "</div>"
    );
  }

  function dishHTML(item) {
    const desc = item.desc && item.desc[lang] ? '<p class="dish-desc">' + item.desc[lang] + "</p>" : "";
    const extra = item.extra && item.extra[lang] ? '<p class="dish-extra">' + item.extra[lang] + "</p>" : "";
    const price = item.price ? '<p class="dish-price">' + item.price + "</p>" : "";
    return (
      '<li class="dish">' +
      photoHTML(item) +
      '<div class="dish-body">' +
      '<div class="dish-top"><p class="dish-name">' + item.name[lang] + "</p>" + price + "</div>" +
      desc + extra + nutriHTML(item) +
      "</div></li>"
    );
  }

  // Indices nutritionnels : un petit badge (feuille + kcal) qui s'ouvre au toucher
  const LEAF =
    '<svg class="nutri-icon" viewBox="0 0 20 20" aria-hidden="true">' +
    '<path d="M4 16C4 9 8.5 4.5 16 4c.4 7.5-4 12-11 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M4 16 11 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

  function fmt(n) {
    return (Math.round(n * 10) / 10).toString().replace(".", lang === "fr" ? "," : ".");
  }

  function nutriHTML(item) {
    const n = item.nutri;
    if (!n) return "";
    const rows = [
      ["nutriProt", n.prot],
      ["nutriGluc", n.gluc],
      ["nutriLip", n.lip],
      ["nutriFib", n.fib],
    ].map(function (r) {
      return '<div class="nutri-cell"><span class="nutri-val">' + fmt(r[1]) + " g</span>" +
        '<span class="nutri-lbl">' + UI_TEXT[r[0]][lang] + "</span></div>";
    }).join("");
    return (
      '<details class="nutri">' +
      "<summary>" + LEAF +
      '<span class="nutri-kcal">' + n.kcal + " kcal</span>" +
      '<span class="nutri-dot">·</span>' +
      '<span class="nutri-prot">' + fmt(n.prot) + " g " + UI_TEXT.nutriProt[lang].toLowerCase() + "</span>" +
      '<span class="nutri-more" aria-hidden="true">+</span>' +
      "</summary>" +
      '<div class="nutri-grid">' + rows + "</div>" +
      '<p class="nutri-note">' + UI_TEXT.nutriNote[lang] + "</p>" +
      "</details>"
    );
  }

  function ledgerHTML(items, layout) {
    return '<ol class="ledger' + (layout === "compact" ? " compact" : "") + '">' + items.map(dishHTML).join("") + "</ol>";
  }

  function groupHTML(g, layout) {
    const note = g.note && g.note[lang] ? '<p class="group-note">' + g.note[lang] + "</p>" : "";
    return (
      '<div class="group">' +
      '<div class="group-head"><h3 class="group-title">' + g.title[lang] + "</h3>" + note + "</div>" +
      ledgerHTML(g.items, layout) +
      "</div>"
    );
  }

  function setHTML(cat, i) {
    const note = cat.note && cat.note[lang] ? '<p class="set-note">' + cat.note[lang] + "</p>" : "";
    const body = cat.groups
      ? cat.groups.map(function (g) { return groupHTML(g, cat.layout); }).join("")
      : ledgerHTML(cat.items, cat.layout);
    return (
      '<section class="set' + (i % 2 ? " alt" : "") + '" id="' + cat.id + '">' +
      '<div class="set-inner">' +
      '<div class="set-head">' +
      "<div>" +
      '<p class="set-label">' + CLOVER + UI_TEXT.setWord[lang] + " " + pad(i + 1) + "</p>" +
      '<h2 class="set-title">' + cat.name[lang] + "</h2>" +
      "</div>" +
      note +
      "</div>" +
      body +
      "</div></section>"
    );
  }

  function render() {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = theme;

    langBtn.innerHTML =
      '<span class="' + (lang === "fr" ? "on" : "") + '">FR</span>' +
      '<span class="sep">·</span>' +
      '<span class="' + (lang === "en" ? "on" : "") + '">EN</span>';

    themeBtn.innerHTML =
      '<span class="dot"></span>' +
      "<span class=\"on\">" + (theme === "bordeaux" ? UI_TEXT.themeBeige[lang] : UI_TEXT.themeBordeaux[lang]) + "</span>";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (UI_TEXT[key]) el.textContent = UI_TEXT[key][lang];
    });

    index.innerHTML = MENU.map(function (cat, i) {
      return (
        '<a href="#' + cat.id + '">' +
        '<span class="mark">' + CLOVER + "</span>" +
        '<span class="num">' + pad(i + 1) + "</span>" +
        cat.name[lang] +
        "</a>"
      );
    }).join("");

    main.innerHTML = MENU.map(function (cat, i) {
      return (i ? '<div class="rule">' + CLOVER + "</div>" : "") + setHTML(cat, i);
    }).join("");

    highlightIndex();
    initReveal();
    initVideos();
  }

  // Apparition douce au défilement
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.__tfIO) window.__tfIO.disconnect();

    const io = new IntersectionObserver(
      function (entries) {
        entries.filter(function (e) { return e.isIntersecting; }).forEach(function (e, i) {
          const el = e.target;
          el.style.setProperty("--d", i * 70 + "ms");
          el.classList.add("is-in");
          io.unobserve(el);
          el.addEventListener("transitionend", function done(ev) {
            if (ev.propertyName !== "opacity") return;
            el.classList.remove("reveal", "is-in");
            el.style.removeProperty("--d");
            el.removeEventListener("transitionend", done);
          });
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );

    main.querySelectorAll(".dish, .set-head, .group-head").forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
    window.__tfIO = io;
  }

  // Le trèfle de l'index se pose sur le set visible
  function highlightIndex() {
    const links = index.querySelectorAll("a");
    const sets = main.querySelectorAll(".set");
    if (!sets.length) return;

    let last = "";
    const onScroll = function () {
      let current = "";
      sets.forEach(function (s) {
        if (s.getBoundingClientRect().top < 160) current = s.id;
      });
      links.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
      });
      if (current !== last) {
        last = current;
        const active = index.querySelector("a.active");
        if (active) {
          index.scrollTo({
            left: active.offsetLeft - (index.clientWidth - active.offsetWidth) / 2,
            behavior: "smooth",
          });
        }
      }
    };

    if (window.__tfScroll) window.removeEventListener("scroll", window.__tfScroll);
    window.__tfScroll = onScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  langBtn.addEventListener("click", function () {
    lang = lang === "fr" ? "en" : "fr";
    localStorage.setItem("tf-lang", lang);
    render();
  });

  themeBtn.addEventListener("click", function () {
    theme = theme === "bordeaux" ? "beige" : "bordeaux";
    localStorage.setItem("tf-theme-ch", theme);
    render();
  });

  render();
})();
