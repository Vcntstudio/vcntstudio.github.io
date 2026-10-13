// VCNT Studio — reads content/site.json and builds the page.
// Content is edited through Pages CMS (or by hand in site.json): no need to touch this file.
import { firebaseConfig, MESSAGES_COLLECTION } from "./firebase-config.js";

const app = document.getElementById("app");

/* ---------- helpers ---------- */
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Tiny text formatter: **bold**, *italic*, blank line = new paragraph
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<em>$1</em>");
const paras = s => String(s || "").split(/\n\s*\n/).filter(p => p.trim()).map(p => `<p>${inline(p.trim())}</p>`).join("");
const list = v => (Array.isArray(v) ? v : []);
const imgSrc = v => (typeof v === "string" ? v : v && (v.image || v.src)) || "";

const ytId = v => {
  if (!v) return "";
  const m = String(v).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(v) ? v : "";
};

const arrow = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`;
const playIcon = `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 3.5v11l9.5-5.5z" fill="currentColor"/></svg>`;

/* ---------- sections ---------- */
function hero(d) {
  const h = d.home || {};
  const bars = Array.from({ length: 64 }, (_, i) => {
    const x = (i - 31.5) / 32;
    const hgt = Math.round(18 + 110 * Math.exp(-x * x * 4) * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7))));
    return `<i style="height:${hgt}px;animation-delay:${(i % 9) * -0.29}s"></i>`;
  }).join("");
  return `
  <section class="hero" id="home">
    <div class="wave" aria-hidden="true">${bars}</div>
    <div class="wrap">
      <p class="label">${esc(h.eyebrow)}</p>
      <h1>${inline(h.headline)}</h1>
      <div class="doors">
        <a class="door" href="#artistic">
          <img src="${esc(h.composer_image)}" alt="${esc(h.composer_title)}" loading="eager">
          <div class="door-body">
            <div><h2>${esc(h.composer_title)}</h2><p>${esc(h.composer_text)}</p></div>
            <span class="arrow">${arrow}</span>
          </div>
        </a>
        <a class="door" href="#studio">
          <img src="${esc(h.studio_image)}" alt="${esc(h.studio_title)}" loading="eager">
          <div class="door-body">
            <div><h2>${esc(h.studio_title)}</h2><p>${esc(h.studio_text)}</p></div>
            <span class="arrow">${arrow}</span>
          </div>
        </a>
      </div>
    </div>
  </section>`;
}

function video(w) {
  const id = ytId(w.youtube);
  const poster = w.video_image || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "");
  if (!id && !poster) return "";
  if (id) {
    return `<div class="video" data-yt="${id}">
      ${poster ? `<img src="${esc(poster)}" alt="" loading="lazy" decoding="async">` : ""}
      <button type="button" aria-label="Play video: ${esc(w.title)}"><span class="play-dot">${playIcon}</span></button>
    </div>`;
  }
  // No link yet: the poster opens a YouTube search for the piece
  const q = encodeURIComponent(`Vincenzo Russo ${w.title}`);
  return `<div class="video">
    <img src="${esc(poster)}" alt="" loading="lazy" decoding="async">
    <a class="play" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener" aria-label="Watch ${esc(w.title)} on YouTube"><span class="play-dot">${playIcon}</span></a>
  </div>`;
}

function work(w) {
  const media = w.image || w.youtube || w.video_image;
  const details = list(w.details).filter(x => x && (x.text || x.label));
  const perfs = list(w.performances).filter(p => p && p.venue);
  return `
  <article class="work${media ? " has-media" : ""}">
    <div>
      <div class="work-head"><h4>${esc(w.title)}</h4>${w.year ? `<span class="year">${esc(w.year)}</span>` : ""}</div>
      ${w.highlight ? `<p class="highlight">${inline(w.highlight)}</p>` : ""}
      ${w.scoring ? `<p class="scoring">${inline(w.scoring)}</p>` : ""}
      ${w.description ? `<div class="work-desc">${paras(w.description)}</div>` : ""}
      ${details.length ? `<ul class="details">${details.map(x => `<li>${x.label ? `<b>${esc(x.label)}:</b> ` : ""}${inline(x.text)}</li>`).join("")}</ul>` : ""}
      ${perfs.length ? `<div class="perfs"><div class="perfs-head">Performances &amp; screenings</div>${perfs.map(p => `
        <div class="perf"><time>${esc(p.date)}</time><div>${inline(p.venue)}<span>${esc(p.place)}</span></div></div>`).join("")}</div>` : ""}
    </div>
    ${media ? `<div class="work-media">
      ${w.image ? `<div class="score"><img src="${esc(w.image)}" alt="Score excerpt — ${esc(w.title)}" loading="lazy" decoding="async"></div>` : ""}
      ${video(w)}
    </div>` : ""}
  </article>`;
}

function artistic(d) {
  const a = d.artistic || {};
  const cats = list(a.categories);
  return `
  <section class="section" id="artistic">
    <div class="wrap">
      <div class="section-head">
        <p class="label">Artistic</p>
        <h2>${esc(d.site?.name || "Vincenzo Russo")}</h2>
      </div>
      <div class="bio">
        <figure>
          <img src="${esc(a.portrait)}" alt="Portrait of ${esc(d.site?.name)}" loading="lazy" decoding="async">
          <figcaption class="label">${esc(a.roles)}</figcaption>
        </figure>
        <div class="bio-text">${paras(a.bio)}</div>
      </div>

      <div class="works">
        <h3 class="sub">Composition</h3>
        ${cats.map((c, i) => `
          <div class="cat">
            <p class="cat-title"><b>${String(i + 1).padStart(2, "0")}</b>${esc(c.title)}</p>
            <div class="cat-list">${list(c.works).map(work).join("")}</div>
          </div>`).join("")}
      </div>

      ${list(a.research).length ? `
      <div class="research">
        <h3 class="sub">${esc(a.research_title)}</h3>
        <div class="research-grid">
          ${list(a.research).map(r => `
            <article class="r-card">
              <p class="label">${esc(r.status)}</p>
              <h4>${esc(r.title)}</h4>
              ${r.subtitle ? `<p class="scoring">${esc(r.subtitle)}</p>` : ""}
              <p>${inline(r.text)}</p>
            </article>`).join("")}
        </div>
      </div>` : ""}
    </div>
  </section>`;
}

function studio(d) {
  const s = d.studio || {};
  const gallery = list(s.gallery).map(imgSrc).filter(Boolean);
  return `
  <section class="section" id="studio">
    <div class="wrap">
      <div class="section-head">
        <p class="label">Studio</p>
        <h2>${esc(d.site?.brand || "VCNT Studio")}</h2>
        <p>${inline(s.intro)}</p>
      </div>

      <div class="services">
        ${list(s.services).map(x => `<div class="service"><h3>${esc(x.title)}</h3><p>${inline(x.text)}</p></div>`).join("")}
      </div>

      <div class="block">
        <h3 class="sub">${esc(s.releases_title)}</h3>
        <div class="releases">
          ${list(s.releases).map(r => {
            const inner = `
              <div class="cover"><img src="${esc(r.cover)}" alt="Cover of ${esc(r.title)}" loading="lazy" decoding="async">
                ${r.link ? `<span class="listen">${playIcon} Listen</span>` : ""}</div>
              <div><h4>${esc(r.title)}</h4><p>${esc(r.artist)}${r.role ? ` · ${esc(r.role)}` : ""}</p></div>`;
            return r.link
              ? `<a class="release" href="${esc(r.link)}" target="_blank" rel="noopener">${inner}</a>`
              : `<div class="release">${inner}</div>`;
          }).join("")}
        </div>
      </div>

      ${gallery.length ? `
      <div class="block">
        <h3 class="sub">The Room</h3>
        <div class="gallery">
          ${gallery.map((g, i) => `<button type="button" data-i="${i}" aria-label="Open photo ${i + 1}"><img src="${esc(g)}" alt="VCNT Studio, photo ${i + 1}" loading="lazy" decoding="async"></button>`).join("")}
        </div>
      </div>` : ""}

      <div class="block faq-wrap">
        <div>
          <h3 class="sub">FAQ</h3>
          <p class="label">Stem delivery</p>
          <div class="specs">
            ${list(s.specs).map(x => `<div class="spec"><span>${esc(x.label)}</span><b>${esc(x.value)}</b></div>`).join("")}
          </div>
          <p class="specs-note">Send stems via SwissTransfer, Dropbox or any cloud to <b>${esc(d.site?.email)}</b>.</p>
        </div>
        <div class="faq">
          ${list(s.faq).map((f, i) => `
            <details${i === 0 ? " open" : ""}>
              <summary><span><span class="q-num">${String(i + 1).padStart(2, "0")}</span>${esc(f.question)}</span><span class="plus" aria-hidden="true">+</span></summary>
              <div class="answer">${list(f.answers).map(a => `<p>${inline(a)}</p>`).join("")}</div>
            </details>`).join("")}
        </div>
      </div>
    </div>
  </section>`;
}

function contact(d) {
  const c = d.contact || {};
  const site = d.site || {};
  const socials = [
    ["Instagram", site.instagram], ["YouTube", site.youtube], ["Spotify", site.spotify]
  ].filter(([, u]) => u);
  return `
  <section class="section" id="contact">
    <div class="wrap contact">
      <div class="contact-info">
        <p class="label">Contact</p>
        <h2 class="sub" style="font-size:clamp(2.3rem,5vw,3.8rem);margin:0">${esc(c.title)}</h2>
        <p style="color:var(--muted);max-width:40ch">${inline(c.text)}</p>
        ${site.email ? `<a class="mail" href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : ""}
        ${socials.length ? `<div class="socials">${socials.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`).join("")}</div>` : ""}
      </div>
      <form class="card" id="contact-form" novalidate>
        <div class="row-2">
          <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required maxlength="120"></div>
          <div class="field"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="200" placeholder="you@example.com"></div>
        </div>
        <div class="field"><label for="f-dept">Message for</label>
          <select id="f-dept" name="department">${list(c.departments).map(x => `<option>${esc(x)}</option>`).join("")}</select>
        </div>
        <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required maxlength="5000"></textarea></div>
        <div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" tabindex="-1" autocomplete="off"></div>
        <button class="btn" type="submit" id="f-send">Send message ${arrow}</button>
        <p class="form-msg" id="f-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>`;
}

/* ---------- behaviour ---------- */
function wireVideos() {
  app.querySelectorAll(".video[data-yt] button").forEach(btn => {
    btn.addEventListener("click", () => {
      const box = btn.closest(".video");
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    });
  });
}

function wireGallery(imgs) {
  if (!imgs.length) return;
  let i = 0, box;
  const show = n => { i = (n + imgs.length) % imgs.length; box.querySelector("img").src = imgs[i]; };
  const close = () => { box?.remove(); box = null; document.removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); };
  app.querySelectorAll(".gallery button").forEach(b => b.addEventListener("click", () => {
    box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img alt="VCNT Studio">
      <button class="lb-btn lb-close" aria-label="Close">×</button>
      <button class="lb-btn lb-prev" aria-label="Previous">‹</button>
      <button class="lb-btn lb-next" aria-label="Next">›</button>`;
    box.addEventListener("click", e => { if (e.target === box) close(); });
    box.querySelector(".lb-close").onclick = close;
    box.querySelector(".lb-prev").onclick = () => show(i - 1);
    box.querySelector(".lb-next").onclick = () => show(i + 1);
    document.body.appendChild(box);
    document.addEventListener("keydown", onKey);
    show(+b.dataset.i);
    box.querySelector(".lb-close").focus();
  }));
}

function wireNav() {
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false");
  }));
  if (!("IntersectionObserver" in window)) return;
  const links = [...nav.querySelectorAll("a")];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  app.querySelectorAll("section[id]").forEach(s => io.observe(s));
}

let firestore = null;
async function getDb() {
  if (firestore) return firestore;
  const v = "10.12.2";
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`);
  const fs = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`);
  const db = fs.getFirestore(initializeApp(firebaseConfig));
  firestore = { db, ...fs };
  return firestore;
}

function wireForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("f-status");
  const send = document.getElementById("f-send");
  const say = (msg, kind) => { status.textContent = msg; status.className = "form-msg " + (kind || ""); };

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return; // spam bot
    if (!data.name.trim() || !data.message.trim()) return say("Please fill in your name and a message.", "err");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return say("Please enter a valid e-mail address.", "err");
    if (!firebaseConfig.apiKey) return say("The form isn't connected yet. Please write to the e-mail address on the left.", "err");

    send.disabled = true;
    say("Sending…");
    try {
      const { db, collection, addDoc, serverTimestamp } = await getDb();
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        name: data.name.trim(),
        email: data.email.trim(),
        department: data.department || "",
        message: data.message.trim(),
        createdAt: serverTimestamp(),
        read: false
      });
      form.reset();
      say("Thank you! Your message has been sent.", "ok");
    } catch (err) {
      console.error(err);
      say("The message couldn't be sent. Please try again or write to the e-mail address on the left.", "err");
    } finally {
      send.disabled = false;
    }
  });
}

/* ---------- boot ---------- */
async function boot() {
  try {
    const res = await fetch("content/site.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    app.innerHTML = hero(d) + artistic(d) + studio(d) + contact(d);
    document.getElementById("foot-left").textContent = `© ${new Date().getFullYear()} ${d.site?.brand || "VCNT Studio"}`;
    document.getElementById("foot-right").textContent = d.site?.footer || "";
    wireVideos();
    wireGallery(list(d.studio?.gallery).map(imgSrc).filter(Boolean));
    wireNav();
    wireForm();
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch (err) {
    console.error(err);
    app.innerHTML = `<p class="loading">Content couldn't be loaded. Open the site through GitHub Pages or a local server.</p>`;
  }
}
boot();
