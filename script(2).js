/* Stövchen Karlsruhe – Inhalte hier pflegen (Beispieldaten, vor Livegang prüfen) */
const DATA = {
  // Bilder: Pfad eintragen, z. B. "bilder/biergarten.jpg". Leer = Kachelwand als Platzhalter
  images: { hero: "", biergarten: "" },
  mail: "mail@stoevchen.com",
  tel: "+49 721 29241",
  telLink: "+4972129241",
  // Index = Wochentag (0 = Sonntag). null = geschlossen
  hours: [null, null, [12, 22], [12, 22], [12, 22], [12, 23], [12, 23]],
  days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  daily: {
    label: "Mittagstisch Di–Fr, 12–17 Uhr",
    items: [
      ["Wochenbowl", "Mac & Cheese, Hackbällchen, Krautsalat, gemischter Salat & Edamame", "12,80 €"],
      ["Paniertes Schnitzel", "dazu Ofenkartoffel mit Schmand & Schnittlauch", "12,80 €"],
      ["Rahmgeschnetzeltes vom Hähnchen", "mit Rösti", "12,80 €"],
      ["Calamares", "mit Pommes & Aioli", "12,80 €"],
    ],
  },
  weekly: {
    label: "Das gibt es zusätzlich in dieser Woche",
    items: [
      ["Hauslimonade „Gerda Frisch“", "Pampelmuse, Grapefruit & Zitrone, 0,3 l", "4,40 €"],
      ["Beschwipste „Gerda Frisch“", "mit Gin und Soda, 0,3 l", "7,20 €"],
      ["Zucchini-Möhren-Puffer", "mit gemischtem Salat & Schnittlauch-Dip", "11,20 €", true],
      ["Kuchen", "pro Stück", "4,20 €"],
    ],
  },
  menu: [
    ["Klassiker", [["Schnitzel", "paniert, mit Beilage und Soße nach Wahl"], ["Maultaschen", "gut bürgerlich"], ["Ofenkartoffeln", "mit Schmand und Schnittlauch"]]],
    ["Aus dem Ofen", [["Flammkuchen", "verschiedene Sorten"], ["Käsespätzle", "mit Röstzwiebeln", "", true]]],
    ["Zum Trinken", [["Waldhaus vom Fass", "frisch gezapft"], ["Hauslimonade", "„Gerda Frisch“"], ["Longdrinks", "z. B. Gin Tonic"], ["Saftschorlen", "und Alkoholfreies"]]],
  ],
};

const $ = (id) => document.getElementById(id);
const wrap = (id, html) => ($(id).innerHTML = `<div class="wrap">${html}</div>`);
const dishes = (items) =>
  items.map(([n, d, p, v]) => `<div class="dish"><div>${n}${v ? '<span class="veg">vegetarisch</span>' : ""}<small>${d}</small></div>${p ? `<b>${p}</b>` : ""}</div>`).join("");
const pic = (key, alt, label, sub) =>
  DATA.images[key]
    ? `<img class="pic" src="${DATA.images[key]}" alt="${alt}"${key === "hero" ? "" : ' loading="lazy"'}>`
    : `<div class="tilewall" role="img" aria-label="${alt}"><div class="plate"><b>${label}</b><span>${sub}</span></div></div>`;

/* Öffnungsstatus (Zeit in Berlin) */
const berlinNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
function statusText() {
  const now = berlinNow(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const today = DATA.hours[d];
  if (today && h >= today[0] && h < today[1]) return { open: true, text: `Jetzt geöffnet bis ${today[1]} Uhr` };
  if (today && h < today[0]) return { open: false, text: `Geschlossen, öffnet heute um ${today[0]} Uhr` };
  for (let i = 1; i <= 7; i++) {
    const n = (d + i) % 7;
    if (DATA.hours[n]) return { open: false, text: `Geschlossen, öffnet ${i === 1 ? "morgen" : "am " + DATA.days[n]} um ${DATA.hours[n][0]} Uhr` };
  }
  return { open: false, text: "Geschlossen" };
}
const st = statusText();

/* Kopf */
$("top-bar").innerHTML = `<span>Waldstraße 54, 76133 Karlsruhe</span><a href="tel:${DATA.telLink}">${DATA.tel}</a>`;
$("site-header").innerHTML = `
  <a class="logo" href="#top-bar" aria-label="Stövchen, nach oben">Stövchen</a>
  <button class="burger" aria-expanded="false" aria-controls="nav">Menü</button>
  <nav id="nav" class="nav" aria-label="Hauptnavigation">
    <a href="#daily-card">Heute</a><a href="#speisekarte">Speisen</a><a href="#biergarten">Biergarten</a>
    <a href="#hours">Zeiten und Kontakt</a><a class="btn" href="#reservation-section">Tisch anfragen</a>
  </nav>`;
const burger = $("site-header").querySelector(".burger"), nav = $("nav");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", nav.classList.toggle("open")));
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });

/* 1. Hero */
wrap("hero", `<div class="hero-grid">
  <div>
    <h1>Besser ist das!</h1>
    <p>Kneipe, Musik und Essen in der südlichen Waldstraße. Seit 1983 mit grünem Kachelofen, ehrlicher Küche und Biergarten.</p>
    <div class="cta"><a class="btn" href="#reservation-section">Tisch anfragen</a><a class="btn ghost" href="#daily-card">Das gibt’s heute</a></div>
    <div class="status ${st.open ? "open" : "closed"}" role="status">${st.text}</div>
  </div>
  ${pic("hero", "Das Stövchen in der Waldstraße", "Seit 1983", "Waldstraße 54, Karlsruhe")}
</div>`);

/* 2. Heute: Tageskarte und Wochenkarte */
wrap("daily-card", `<h2>Heute im Stövchen</h2>
  <div class="tabs" role="tablist" aria-label="Karte wählen">
    <button class="tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">Tageskarte</button>
    <button class="tab" role="tab" id="t2" aria-selected="false" aria-controls="p2">Wochenkarte</button>
  </div>
  <div id="p1" class="list" role="tabpanel" aria-labelledby="t1"><p class="lead">${DATA.daily.label}</p>${dishes(DATA.daily.items)}</div>
  <div id="p2" class="list" role="tabpanel" aria-labelledby="t2" hidden><p class="lead">${DATA.weekly.label}</p>${dishes(DATA.weekly.items)}</div>`);
document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () =>
  document.querySelectorAll(".tab").forEach((t) => { const on = t === b; t.setAttribute("aria-selected", on); $(t.getAttribute("aria-controls")).hidden = !on; })));

/* 3. Speisen und Getränke */
wrap("speisekarte", `<h2>Speisen und Getränke</h2><p class="lead">Die Klassiker gibt es immer. Was sich wöchentlich ändert, steht oben bei „Heute“.</p>
  <div class="menu">${DATA.menu.map(([t, i]) => `<div><h3>${t}</h3>${dishes(i)}</div>`).join("")}</div>
  <p class="note">Beispielinhalte: Die vollständige Karte mit Preisen folgt.</p>`);

/* 4. Bewertung */
wrap("review", `<div class="rate"><span class="stars" aria-label="4,5 von 5 Sternen">★★★★★</span>
  <span><b>4,5 von 5 bei Google</b>, über 2.700 Bewertungen. Gäste loben große Portionen, Flammkuchen und Käsespätzle.</span></div>`);

/* 5. Biergarten */
wrap("biergarten", `<div class="two">
  ${pic("biergarten", "Der Biergarten im Stövchen", "Biergarten", "zwischen Sandsteinmauern")}
  <div><h2>Der Biergarten</h2>
    <p>Zwischen kühlen Sandsteinmauern und schattigen Plätzen: für laue Sommerabende, ein Feierabendbier oder ein Mittagessen in der Sonne.</p>
    <ul class="facts"><li>Frisch gezapftes Bier und Hauslimonade</li><li>Für Gruppen bitte vorab anfragen</li><li>Drinnen: Kachelofen und Emaille-Schilder</li></ul></div></div>`);

/* 6. Reservierung */
wrap("reservation-section", `<h2>Tisch anfragen</h2><p class="lead">Besonders für größere Gruppen. Wir melden uns per E-Mail oder Telefon zurück. Die Anfrage ist noch keine feste Reservierung.</p>
  <form id="res-form">
    <div class="row">
      <label>Datum<input type="date" name="datum" required></label>
      <label>Uhrzeit<input type="time" name="zeit" min="12:00" max="22:00" value="18:00" required></label>
      <label>Personen<input type="number" name="personen" min="1" max="60" value="6" required></label>
    </div>
    <label>Name<input type="text" name="name" autocomplete="name" required></label>
    <label>Telefon oder E-Mail<input type="text" name="kontakt" required></label>
    <label>Anmerkung<textarea name="text" rows="3" placeholder="z. B. Biergarten, Kinderstuhl, Geburtstag"></textarea></label>
    <div><button class="btn" type="submit">Anfrage senden</button></div>
    <p id="form-msg" role="status"></p>
  </form>`);
const form = $("res-form");
form.datum.min = berlinNow().toISOString().slice(0, 10);
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const msg = $("form-msg"), btn = form.querySelector("button");
  btn.disabled = true;
  msg.textContent = "Wird gesendet …";
  try {
    const r = await fetch("/api/reservierung", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error(r.status);
    form.reset();
    msg.textContent = "Danke, deine Anfrage ist angekommen. Wir melden uns bei dir. Sie ist noch keine feste Reservierung.";
  } catch {
    // Kein Server (z. B. GitHub Pages): Anfrage per Mailprogramm
    const body = [`Datum: ${data.datum}`, `Uhrzeit: ${data.zeit}`, `Personen: ${data.personen}`, `Name: ${data.name}`, `Kontakt: ${data.kontakt}`, `Anmerkung: ${data.text || "-"}`].join("\n");
    location.href = `mailto:${DATA.mail}?subject=${encodeURIComponent("Tischanfrage " + data.datum)}&body=${encodeURIComponent(body)}`;
    msg.textContent = "Dein Mailprogramm öffnet sich. Die Anfrage ist erst verschickt, wenn du sie dort absendest.";
  }
  btn.disabled = false;
});

/* 7. Öffnungszeiten und Kontakt */
const todayIdx = berlinNow().getDay();
const rows = [2, 3, 4, 5, 6, 0, 1].map((d) => {
  const h = DATA.hours[d];
  return `<tr class="${d === todayIdx ? "today" : ""}"><td>${DATA.days[d]}</td><td>${h ? `${h[0]}–${h[1]} Uhr` : d === 1 ? "Ruhetag" : "geschlossen"}</td></tr>`;
}).join("");
wrap("hours", `<div class="two" style="align-items:start">
  <div><h2>Öffnungszeiten</h2><p class="lead">${st.text}.</p><table><tbody>${rows}</tbody></table></div>
  <div><h2>So erreichst du uns</h2>
    <address><b>Gaststätte Stövchen</b><br>Waldstraße 54<br>76133 Karlsruhe<br><br><a href="tel:${DATA.telLink}">${DATA.tel}</a><br><a href="mailto:${DATA.mail}">${DATA.mail}</a></address>
    <a class="btn ghost" href="https://www.google.com/maps/search/?api=1&query=Gaststätte+Stövchen+Waldstraße+54+Karlsruhe" target="_blank" rel="noopener">Route in Google Maps</a>
    <p class="note">Die Karte öffnet sich in einem neuen Tab, vorher werden keine Daten an Google übertragen.</p></div></div>`);

/* Fuß: Gutschein, Job, Rechtliches */
$("site-footer").innerHTML = `
  <div><a href="mailto:${DATA.mail}?subject=Gutschein">Gutschein anfragen</a><a href="mailto:${DATA.mail}?subject=Bewerbung">Jobs im Stövchen</a>
  <a href="https://www.instagram.com/stoevchen_karlsruhe/" rel="noopener">Instagram</a><a href="https://de-de.facebook.com/stoevchen.karlsruhe/" rel="noopener">Facebook</a></div>
  <div><a href="#impressum">Impressum</a><a href="#datenschutz">Datenschutz</a></div>
  <p>© ${new Date().getFullYear()} Gaststätte Stövchen, Waldstraße 54, 76133 Karlsruhe</p>`;
