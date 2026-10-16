/* Prestige Healthcare. Ванильный JS: меню, якоря, карточки услуг, ленты, петли видео, параллакс героя, язык, форма. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var VW = W.innerWidth;
  var LANG = "ru";

  /* ---------- Контакты ---------- */
  var WA_NUM = "77785789610";

  /* ---------- WhatsApp: текст собирается в момент клика (фаза захвата на window, совместимо с LeadBot) ---------- */
  var SITE = "Пишу с сайта Prestige Healthcare.";
  var HI = "Здравствуйте! " + SITE + " ";
  var WA = { ru: {
    "default": HI + "Хочу записаться на бесплатную консультацию.",
    hdr: HI + "Хочу записаться на консультацию.",
    hero: HI + "Хочу записаться на бесплатную консультацию по пересадке волос.",
    menu: HI + "Хочу записаться на консультацию.",
    hair: HI + "Интересует пересадка волос. Хочу узнать, подойдёт ли мне, и записаться на консультацию.",
    fue: HI + "Интересует пересадка волос методом FUE. Хочу записаться на консультацию.",
    dhi: HI + "Интересует пересадка волос методом DHI. Хочу записаться на консультацию.",
    brows: HI + "Интересует пересадка бровей. Хочу записаться на консультацию.",
    beard: HI + "Интересует пересадка бороды. Хочу записаться на консультацию.",
    trich: HI + "Нужна консультация трихолога по выпадению волос.",
    lor: HI + "Хочу записаться на приём к ЛОРу.",
    results: HI + "Посмотрел результаты до и после, хочу записаться на бесплатную консультацию по пересадке волос.",
    doc: HI + "Хочу записаться на консультацию к врачу Дархану Ондаханову.",
    price: HI + "Хочу узнать стоимость пересадки волос и записаться на консультацию.",
    pfue: HI + "Хочу узнать стоимость пересадки волос методом FUE.",
    pdhi: HI + "Хочу узнать стоимость пересадки волос методом DHI.",
    faq: HI + "У меня вопрос по пересадке волос.",
    kontakty: HI + "Хочу записаться на бесплатную консультацию.",
    sticky: HI + "Хочу записаться на бесплатную консультацию."
  } };
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var d = WA[LANG] || WA.ru;
    var text = d[key] || d["default"] || WA.ru[key] || WA.ru["default"];
    a.setAttribute("href", "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- fitText: заголовок героя не шире колонки (длинные казахские слова) ---------- */
  var h1 = doc.getElementById("h1");
  function fitText() {
    if (!h1) return;
    h1.style.removeProperty("font-size");
    var fs = parseFloat(getComputedStyle(h1).fontSize), guard = 0;
    var lines = h1.querySelectorAll(".l1,.l2");
    function over() { for (var i = 0; i < lines.length; i++) if (lines[i].scrollWidth > h1.clientWidth + 1) return true; return false; }
    while (guard++ < 20 && over() && fs > 26) { fs *= 0.95; h1.style.fontSize = fs + "px"; }
  }

  /* ---------- Меню ---------- */
  var burger = doc.querySelector(".burger"), menu = doc.getElementById("menu");
  var behind = [doc.getElementById("main"), doc.querySelector(".foot"), doc.getElementById("sticky")];
  function setMenu(open, returnFocus) {
    if (!menu || !burger) return;
    var was = doc.body.classList.contains("menu-open");
    if (open === was) return;
    doc.body.classList.toggle("menu-open", open);
    behind.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 320);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });
  W.matchMedia("(min-width:1281px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  /* ---------- Якоря: цель под шапку, без смещения ---------- */
  var hdr = doc.getElementById("hdr");
  function HDR() { return hdr ? hdr.getBoundingClientRect().height : 72; }
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.id === "top") return 0;
    if (el.classList.contains("sec")) return r - HDR() + 1;
    return r - HDR() - 16;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    setMenu(false);
    var top = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, top); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (goTo(id)) {
      e.preventDefault();
      try { history.pushState(null, "", "#" + id); } catch (err) {}
      var t = doc.getElementById(id);
      if (t) {
        var f = t.id === "zayavka" ? t.querySelector("input,textarea") : t;
        if (f && !f.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(f.tagName)) f.setAttribute("tabindex", "-1");
        try { f.focus({ preventScroll: true }); } catch (err2) {}
      }
    }
  });

  /* ---------- Карточки услуг: «Подробнее» ---------- */
  [].forEach.call(doc.querySelectorAll(".more[aria-controls]"), function (b) {
    b.addEventListener("click", function () {
      var box = doc.getElementById(b.getAttribute("aria-controls")); if (!box) return;
      var open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", open ? "true" : "false");
      box.hidden = !open;
    });
  });

  /* ---------- Скролл: шапка, липкая панель, параллакс фото героя ---------- */
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty");
  var heroMedia = doc.querySelector(".hero-media");
  var PARALLAX = !REDUCED && W.matchMedia("(min-width:761px) and (hover:hover)").matches;
  var ticking = false;
  function update() {
    ticking = false;
    var y = W.pageYOffset, H = W.innerHeight;
    if (hdr) hdr.classList.toggle("scrolled", y > 12);
    if (sticky) {
      var show = y > H * 0.5;
      if (kont) { var kt = kont.getBoundingClientRect().top; if (kt < H * 0.5) show = false; }
      sticky.classList.toggle("show", show);
    }
    if (PARALLAX && heroMedia && y < H * 1.2) heroMedia.style.setProperty("--py", (y * 0.12).toFixed(1) + "px");
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth !== VW) { VW = W.innerWidth; fitText(); updateRails(); }
    onScroll();
  });

  /* ---------- Петли видео: src подставляется, когда кадр в зоне видимости ---------- */
  var loops = [].slice.call(doc.querySelectorAll("video.loop"));
  function playLoop(v) {
    if (!v.getAttribute("src")) {
      v.setAttribute("src", v.getAttribute("data-src"));
      v.addEventListener("playing", function () { v.classList.add("playing"); }, { once: true });
      v.load();
    }
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  if (loops.length && !REDUCED && "IntersectionObserver" in W) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) playLoop(x.target); else if (!x.target.paused) x.target.pause(); });
    }, { threshold: 0.35 });
    loops.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- Ленты со стрелками ---------- */
  var rails = [].slice.call(doc.querySelectorAll(".rail"));
  function railStep(rail) {
    var card = rail.firstElementChild; if (!card) return 300;
    var cs = getComputedStyle(rail);
    var gap = parseFloat(cs.columnGap || cs.gap) || 16;
    return card.getBoundingClientRect().width + gap;
  }
  function updateRail(rail) {
    var btns = doc.querySelectorAll('.arr[data-for="' + rail.id + '"]');
    var max = rail.scrollWidth - rail.clientWidth;
    var none = max <= 1;
    [].forEach.call(btns, function (b) {
      b.hidden = none;
      var dir = +b.getAttribute("data-dir");
      b.disabled = dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2;
    });
  }
  function updateRails() { rails.forEach(updateRail); }
  rails.forEach(function (rail) {
    rail.addEventListener("scroll", function () { updateRail(rail); }, { passive: true });
    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); rail.scrollBy({ left: railStep(rail), behavior: REDUCED ? "auto" : "smooth" }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); rail.scrollBy({ left: -railStep(rail), behavior: REDUCED ? "auto" : "smooth" }); }
    });
  });
  [].forEach.call(doc.querySelectorAll(".arr[data-for]"), function (b) {
    b.addEventListener("click", function () {
      var rail = doc.getElementById(b.getAttribute("data-for")); if (!rail) return;
      rail.scrollBy({ left: railStep(rail) * (+b.getAttribute("data-dir")), behavior: REDUCED ? "auto" : "smooth" });
    });
  });

  /* ---------- Язык: RU в разметке, KZ и EN подгружаются отдельными файлами ---------- */
  var I18N = { ru: {} };
  var RU = I18N.ru;
  var iEls = [].slice.call(doc.querySelectorAll("[data-i]"));
  var phEls = [].slice.call(doc.querySelectorAll("[data-i-ph]"));
  var ariaEls = [].slice.call(doc.querySelectorAll("[data-i-aria]"));
  var altEls = [].slice.call(doc.querySelectorAll("[data-i-alt]"));
  var metaDesc = doc.querySelector('meta[name="description"]');
  iEls.forEach(function (el) { RU[el.getAttribute("data-i")] = el.textContent; });
  phEls.forEach(function (el) { RU[el.getAttribute("data-i-ph")] = el.getAttribute("placeholder"); });
  ariaEls.forEach(function (el) { RU[el.getAttribute("data-i-aria")] = el.getAttribute("aria-label"); });
  altEls.forEach(function (el) { RU[el.getAttribute("data-i-alt")] = el.getAttribute("alt") || el.getAttribute("aria-label"); });
  RU["meta.title"] = doc.title;
  RU["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";
  var FORM_LABELS = { ru: { head: "Заявка с сайта Prestige Healthcare", name: "Имя", phone: "Телефон", msg: "Что беспокоит" } };
  function t(key) { var d = I18N[LANG] || RU; return d[key] != null ? d[key] : RU[key]; }
  function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    LANG = lang;
    iEls.forEach(function (el) { var v = t(el.getAttribute("data-i")); if (v != null) el.textContent = v; });
    phEls.forEach(function (el) { var v = t(el.getAttribute("data-i-ph")); if (v != null) el.setAttribute("placeholder", v); });
    ariaEls.forEach(function (el) { var v = t(el.getAttribute("data-i-aria")); if (v != null) el.setAttribute("aria-label", v); });
    altEls.forEach(function (el) { var v = t(el.getAttribute("data-i-alt")); if (v != null) { if (el.tagName === "IMG") el.setAttribute("alt", v); else el.setAttribute("aria-label", v); } });
    doc.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    root.setAttribute("lang", lang);
    [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("prestige-lang", lang); } catch (e) {}
    fitText();
    updateRails();
  }
  function loadLang(lang, done) {
    if (I18N[lang] || (lang !== "kk" && lang !== "en")) return done();
    var s = doc.createElement("script");
    s.src = "assets/lang/" + lang + ".js" + (ASSET_V ? "?v=" + ASSET_V : "");
    s.onload = function () {
      var dict = lang === "kk" ? W.SITE_KK : W.SITE_EN;
      if (dict) {
        I18N[lang] = dict;
        var wa = lang === "kk" ? W.SITE_KK_WA : W.SITE_EN_WA; if (wa) WA[lang] = wa;
        var fl = lang === "kk" ? W.SITE_KK_FORM : W.SITE_EN_FORM; if (fl) FORM_LABELS[lang] = fl;
      }
      done();
    };
    s.onerror = function () { done(); };
    doc.head.appendChild(s);
  }
  function setLang(lang) { loadLang(lang, function () { applyLang(lang); }); }
  [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  (function initLang() {
    var forced = (location.search.match(/[?&]lang=(ru|kk|en)/) || [])[1];
    var saved = null; try { saved = localStorage.getItem("prestige-lang"); } catch (e) {}
    var lang = forced || saved || "ru";
    if (lang !== "ru") setLang(lang);
    else if (forced) { try { localStorage.setItem("prestige-lang", "ru"); } catch (e2) {} }
  })();

  /* ---------- Проявление секций ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) el.classList.add("in"); }); }, 1500);
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* ---------- Форма -> WhatsApp ---------- */
  var form = doc.getElementById("form"), thanks = doc.getElementById("thanks"), ferr = doc.getElementById("ferr");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.website && f.website.value) { form.hidden = true; if (thanks) thanks.hidden = false; return; }
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      var badName = !name, badPhone = phone.replace(/\D/g, "").length < 10;
      f.name.classList.toggle("bad", badName); f.phone.classList.toggle("bad", badPhone);
      f.name.setAttribute("aria-invalid", badName ? "true" : "false"); f.phone.setAttribute("aria-invalid", badPhone ? "true" : "false");
      if (badName || badPhone) { if (ferr) ferr.hidden = false; (badName ? f.name : f.phone).focus(); return; }
      if (ferr) ferr.hidden = true;
      var L = FORM_LABELS[LANG] || FORM_LABELS.ru;
      var lines = [L.head, L.name + ": " + name, L.phone + ": " + phone];
      if (f.message.value.trim()) lines.push(L.msg + ": " + f.message.value.trim());
      var url = "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(lines.join("\n"));
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Старт ---------- */
  function start() {
    fitText();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      goTo(id, true);
      setTimeout(function () { goTo(id, true); }, 500);
    }
    update();
    updateRails();
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitText(); updateRails(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  update();
})();
