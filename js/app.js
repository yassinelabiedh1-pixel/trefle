/* ============================================================
   Treffel Padel Club — rendu de la carte
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
  let theme = localStorage.getItem("tf-theme") || document.documentElement.dataset.theme || "forest";

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
      img.src = "images/produits/" + img.dataset.slug + "." + PHOTO_EXTS[next];
    } else {
      img.remove();
    }
  };

  window.__tfImgLoaded = function (img) {
    img.closest(".dish-photo").classList.add("has-img");
  };

  // Vidéo : si images/produits/<nom>.mp4 (ou .webm) existe, elle joue en boucle,
  // muette, par-dessus la photo. Sinon la vidéo disparaît et la photo reste.
  window.__tfVideoFail = function (src) {
    const video = src.closest("video");
    if (video.dataset.fixed === "1" || src.nextElementSibling === null) { video.remove(); return; }
    src.remove();
    video.load();
  };
  window.__tfVideoOk = function (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.closest(".dish-photo").classList.add("has-video");
    watchVideo(video);
  };

  // La vidéo ne joue que lorsqu'elle est à l'écran
  function watchVideo(video) {
    if (video.dataset.watched === "1") return;
    video.dataset.watched = "1";
    if (!("IntersectionObserver" in window)) { video.play().catch(function () {}); return; }
    if (!window.__tfVideoIO) {
      window.__tfVideoIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.play().catch(function () {});
          else e.target.pause();
        });
      }, { threshold: 0.25 });
    }
    window.__tfVideoIO.observe(video);
  }

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
    let video;
    if (item.video) {
      video =
        '<video muted loop playsinline preload="metadata" data-fixed="1" oncanplay="window.__tfVideoOk(this)">' +
        '<source src="' + item.video + '" onerror="window.__tfVideoFail(this)" />' +
        "</video>";
    } else {
      const vslug = item.photo ? slugify(item.name.fr) : src.replace(/^images\/produits\//, "").replace(/\.[a-z]+$/, "");
      video =
        '<video muted loop playsinline preload="metadata" oncanplay="window.__tfVideoOk(this)">' +
        '<source src="images/produits/' + vslug + '.mp4" onerror="window.__tfVideoFail(this)" />' +
        '<source src="images/produits/' + vslug + '.webm" onerror="window.__tfVideoFail(this)" />' +
        "</video>";
    }
    return (
      '<div class="dish-photo">' +
      CLOVER +
      '<img src="' + src + '" alt="' + item.name[lang] + '" loading="lazy"' + attrs +
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
      desc + extra +
      "</div></li>"
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
      "<span class=\"on\">" + (theme === "forest" ? UI_TEXT.themeCream[lang] : UI_TEXT.themeForest[lang]) + "</span>";

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
    theme = theme === "forest" ? "cream" : "forest";
    localStorage.setItem("tf-theme", theme);
    render();
  });

  render();
})();
