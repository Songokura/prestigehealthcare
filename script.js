/* Prestige Healthcare. Ванильный JS: плиты и точечная посадка, меню, якоря, лента, петли видео, язык, форма. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };
  var easeOut = function (x) { x = clamp(x); return 1 - Math.pow(1 - x, 2.2); };
  var TOUCH = W.matchMedia("(pointer:coarse)").matches;
  var VW = W.innerWidth, VH = W.innerHeight;
  var LANG = "ru";

  /* ---------- Контакты ---------- */
  var WA_NUM = "77785789610";

  /* ---------- WhatsApp: текст собирается в момент клика (фаза захвата на window, совместимо с LeadBot) ---------- */
  var SITE = "Пишу с сайта Prestige Healthcare.";
  var WA = { ru: {
    "default": "Здравствуйте! " + SITE + " Хочу записаться на бесплатную консультацию по пересадке волос.",
    hero: "Здравствуйте! " + SITE + " Хочу записаться на бесплатную консультацию по пересадке волос.",
    menu: "Здравствуйте! " + SITE + " Хочу записаться на консультацию.",
    hair: "Здравствуйте! " + SITE + " Интересует пересадка волос (FUE / DHI). Хочу узнать, подойдёт ли мне, и записаться на консультацию.",
    brows: "Здравствуйте! " + SITE + " Интересует пересадка бровей. Хочу записаться на консультацию.",
    beard: "Здравствуйте! " + SITE + " Интересует пересадка бороды. Хочу записаться на консультацию.",
    trich: "Здравствуйте! " + SITE + " Нужна консультация трихолога по выпадению волос.",
    lor: "Здравствуйте! " + SITE + " Хочу записаться на приём к ЛОРу.",
    results: "Здравствуйте! " + SITE + " Посмотрел результаты до и после, хочу записаться на бесплатную консультацию по пересадке волос.",
    kontakty: "Здравствуйте! " + SITE + " Хочу записаться на бесплатную консультацию.",
    sticky: "Здравствуйте! " + SITE + " Хочу записаться на бесплатную консультацию."
  } };
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var d = WA[LANG] || WA.ru;
    var text = d[key] || WA.ru[key] || WA.ru["default"];
    a.setAttribute("href", "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- fitText для строк заголовка героя ---------- */
  var h1 = doc.getElementById("h1");
  function fitLine(sel, prop) {
    var l = h1.querySelector(sel), avail = h1.clientWidth;
    if (!l || !avail) return;
    h1.style.removeProperty(prop);
    var fs = parseFloat(getComputedStyle(l).fontSize), guard = 0;
    while (guard++ < 30 && l.scrollWidth > avail + 1 && fs > 20) { fs *= 0.95; h1.style.setProperty(prop, fs + "px"); }
  }
  function fitText() { if (!h1) return; fitLine(".l1", "--fs"); fitLine(".l2", "--fs2"); }

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

  /* ---------- Якоря ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdr")) || 72; };
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.classList.contains("pw")) return r;
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
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

  /* ---------- Плиты и точечная посадка ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var heroTxt = doc.querySelector(".hero-txt");
  var INTRO = (location.hash.length > 1 || W.pageYOffset > 80 || REDUCED) ? 1 : 0;
  var introStart = 0, ticking = false;

  var st = pws.map(function (pw) { return { open: -1, out: {}, sigs: [].slice.call(pw.querySelectorAll(".sig")) }; });
  function put(pw, s, k, v) { if (s.out[k] !== v) { s.out[k] = v; pw.style.setProperty(k, v); } }
  function update() {
    ticking = false;
    var H = VH;
    var pageY = W.pageYOffset;
    var kontTop = kont ? kont.getBoundingClientRect().top : null;
    var rects = [], nxtTops = [], i;
    for (i = 0; i < pws.length; i++) {
      rects.push(pws[i].getBoundingClientRect());
      var nx = pws[i].nextElementSibling;
      nxtTops.push(nx ? nx.getBoundingClientRect().top : null);
    }
    for (i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i], s = st[i];
      var near = r.bottom > -H * 0.5 && r.top < H * 1.5;
      if (!near && s.open >= 0) continue;
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
      var exit = nxtTops[i] !== null ? clamp(1 - nxtTops[i] / H) : 0;
      var isHero = pw.classList.contains("pw-hero");
      /* посадка: точки растут по въезду плиты, старт с 22% хода, легко дотягиваются */
      var open = isHero ? easeOut(INTRO) : easeOut(smooth((enter - 0.22) / 0.6));
      if (REDUCED) open = 1;
      s.open = open;
      put(pw, s, "--enter", enter.toFixed(4));
      put(pw, s, "--stay", stay.toFixed(4));
      put(pw, s, "--exit", exit.toFixed(4));
      put(pw, s, "--open", open.toFixed(4));
      if (isHero) {
        put(pw, s, "--intro", open.toFixed(4));
        if (heroTxt) heroTxt.classList.toggle("done", open >= 0.999);
      }
      /* посадка завершена: маска снята, кадр чистый. У героя маска возвращается на выходе (извлечение) */
      var done = isHero ? (open >= 0.999 && (exit < 0.005 || VW <= 760)) : open >= 0.999;
      for (var g = 0; g < s.sigs.length; g++) s.sigs[g].classList.toggle("done", done);
      var plate = pw.firstElementChild;
      if (plate) plate.classList.toggle("gone", exit >= 1);
      if (!s.txts) s.txts = pw.querySelectorAll(".txt");
      var on = isHero ? INTRO > 0.3 : enter > 0.62;
      if (s.on !== on) { s.on = on; for (var t = 0; t < s.txts.length; t++) s.txts[t].classList.toggle("on", on); }
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (kontTop !== null && kontTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) hdr.classList.toggle("scrolled", pageY > 12);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth !== VW) { VW = W.innerWidth; VH = W.innerHeight; fitText(); updateRails(); }
    else if (!TOUCH) VH = W.innerHeight;
    onScroll();
  });
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = clamp((ts - introStart) / 1250);
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }

  /* ---------- Петли видео: src подставляется, когда карточка в кадре ---------- */
  var loops = [].slice.call(doc.querySelectorAll("video.loop"));
  function playLoop(v) {
    if (!v.getAttribute("src")) { v.setAttribute("src", v.getAttribute("data-src")); v.load(); }
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  if (loops.length && !REDUCED && "IntersectionObserver" in W) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) playLoop(x.target); else if (!x.target.paused) x.target.pause(); });
    }, { threshold: 0.45 });
    loops.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- Лента со стрелками ---------- */
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
  /* ---------- Бегущая лента: шаг цикла = одна копия, копий хватает на любую ширину ---------- */
  var rTrack = doc.querySelector(".ribbon-track");
  var rOrig = rTrack ? [].slice.call(rTrack.children) : [];
  function buildRibbon() {
    if (!rTrack || !rOrig.length) return;
    [].slice.call(rTrack.querySelectorAll(".rb-c")).forEach(function (el) { el.remove(); });
    var one = rTrack.scrollWidth;
    if (!one) return;
    var n = Math.ceil(W.innerWidth / one) + 1;
    for (var k = 0; k < n; k++) rOrig.forEach(function (el) {
      var c = el.cloneNode(true); c.removeAttribute("data-i"); c.className = "rb-c"; rTrack.appendChild(c);
    });
    var step = rTrack.children[rOrig.length].offsetLeft - rOrig[0].offsetLeft;
    rTrack.style.setProperty("--rib", step + "px");
    rTrack.style.setProperty("--rib-t", (step / 60).toFixed(1) + "s");
  }
  var rbT;
  W.addEventListener("resize", function () { clearTimeout(rbT); rbT = setTimeout(buildRibbon, 200); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(buildRibbon);
  buildRibbon();

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
    buildRibbon();
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
      setTimeout(function () { goTo(id, true); update(); }, 60);
      setTimeout(function () { goTo(id, true); update(); }, 500);
    }
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
    updateRails();
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitText(); update(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  update();
})();
