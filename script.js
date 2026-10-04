/* Stövchen Karlsruhe – Inhalte hier pflegen (Beispieldaten, vor Livegang prüfen) */
const DATA = {
  // Bilder: Pfad eintragen, z. B. "bilder/biergarten.jpg". Leer = Platzhalter "Foto folgt"
  images: { welcome: "", biergarten: "" },
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
    label: "Diese Woche zusätzlich",
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
    ["Vom Fass und aus der Flasche", [["Waldhaus vom Fass", "frisch gezapft"], ["Hauslimonade", "„Gerda Frisch“"], ["Longdrinks", "z. B. Gin Tonic"], ["Saftschorlen", "und Alkoholfreies"]]],
  ],
};

const $ = (id) => document.getElementById(id);
const wrap = (id, html) => ($(id).innerHTML = `<div class="wrap">${html}</div>`);
const photo = (key, alt) =>
  DATA.images[key] ? `<img class="photo" src="${DATA.images[key]}" alt="${alt}" loading="lazy">` : `<div class="photo ph">Foto folgt: ${alt}</div>`;
const dishes = (items) =>
  items.map(([n, d, p, v]) => `<div class="dish"><div>${n}${v ? '<span class="veg">vegetarisch</span>' : ""}<small>${d}</small></div>${p ? `<b>${p}</b>` : ""}</div>`).join("");

/* Öffnungsstatus (Zeit in Berlin) */
function berlinNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
}
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

/* Kopf */
$("top-bar").innerHTML = `<span>Waldstraße 54, 76133 Karlsruhe</span><a href="tel:${DATA.telLink}">${DATA.tel}</a>`;
$("site-header").innerHTML = `
  <a class="logo" href="#top-bar" aria-label="Stövchen, nach oben">Stövchen</a>
  <button class="burger" aria-expanded="false" aria-controls="nav">Menü</button>
  <nav id="nav" class="nav" aria-label="Hauptnavigation">
    <a href="#daily-card">Tageskarte</a><a href="#speisekarte">Speisen</a>
    <a href="#hours">Öffnungszeiten</a><a href="#kontakt">Kontakt</a>
    <a class="btn" href="#reservation-section">Tisch anfragen</a>
  </nav>`;
const burger = $("site-header").querySelector(".burger"), nav = $("nav");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", nav.classList.toggle("open")));
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });

/* Hero */
const st = statusText();
wrap("hero", `
  <div class="sign">
    <h1>Besser ist das!</h1>
    <div class="tag">Kneipe – Musik – Essen</div>
    <p>Grüner Kachelofen, Emaille-Schilder an den Wänden und ein Biergarten hinter Sandsteinmauern: Willkommen in der südlichen Waldstraße.</p>
    <div class="cta"><a class="btn" href="#reservation-section">Tisch anfragen</a><a class="btn ghost" href="#daily-card">Das gibt’s heute</a></div>
  </div>
  <div class="status ${st.open ? "open" : "closed"}" role="status">${st.text}</div>`);

/* Willkommen */
wrap("welcome", `
  <div class="two">
    <div>
      <h2>Seit 1983 in der Waldstraße</h2>
      <p>Das Stövchen ist Frühstücksplatz, Mittagstreff und Feierabendkneipe in einem. Es gibt ehrliche, gut bürgerliche Küche mit Schnitzel, Flammkuchen und Maultaschen, frisch gezapftes Bier und hausgemachte Limonade.</p>
      <p style="margin-top:12px">Im Sommer sitzt du im Biergarten zwischen kühlen Sandsteinmauern, im Winter am grünen Kachelofen.</p>
    </div>
    <div>${photo("welcome", "Kachelofen im Stövchen")}<ul class="facts"><li>Seit über 40 Jahren Gastgeber</li><li>Biergarten mit Schatten und Sandstein</li><li>Montag Ruhetag, Sonntag geschlossen</li></ul></div>
  </div>`);

/* Tageskarte, Speisekarte, Wochenkarte */
wrap("daily-card", `<h2>Tageskarte</h2><p class="lead">${DATA.daily.label}</p><div class="plate">${dishes(DATA.daily.items)}</div>`);
wrap("speisekarte", `<h2>Speisen und Getränke</h2><p class="lead">Die Klassiker gibt es immer. Was sich wöchentlich ändert, steht in Tages- und Wochenkarte.</p>
  <div class="grid c3">${DATA.menu.map(([t, i]) => `<div class="plate"><h3>${t}</h3>${dishes(i)}</div>`).join("")}</div>
  <p class="note">Beispielinhalte: Die vollständige Karte mit Preisen kommt aus der Admin-Pflege.</p>`);
wrap("weekly-card", `<h2>Wochenkarte</h2><p class="lead">${DATA.weekly.label}</p><div class="plate">${dishes(DATA.weekly.items)}</div>`);

/* Öffnungszeiten */
const todayIdx = berlinNow().getDay();
const rows = [2, 3, 4, 5, 6, 0, 1].map((d) => {
  const h = DATA.hours[d];
  const label = h ? `${h[0]}–${h[1]} Uhr` : d === 1 ? "Ruhetag" : "geschlossen";
  return `<tr class="${d === todayIdx ? "today" : ""}"><td>${DATA.days[d]}</td><td>${label}</td></tr>`;
}).join("");
wrap("hours", `<h2>Öffnungszeiten</h2><p class="lead">${st.text}.</p><table><tbody>${rows}</tbody></table>`);

/* Weitere Wege */
wrap("ways", `<h2>Mehr vom Stövchen</h2><div class="grid c3" style="margin-top:20px">
  <div class="plate">${photo("biergarten", "Biergarten")}<h3>Biergarten</h3><p>Laue Sommerabende, ein kühles Bier nach der Arbeit oder Mittagessen in der Sonne. Bei Gruppen lohnt die Anfrage vorab.</p></div>
  <div class="plate"><h3>Gutschein</h3><p>Ein Geschenk für Stövchen-Fans. Schreib uns kurz, welchen Wert du möchtest.</p><p style="margin-top:12px"><a class="btn ghost" href="mailto:${DATA.mail}?subject=Gutschein">Gutschein anfragen</a></p></div>
  <div class="plate"><h3>Job im Stövchen</h3><p>Wir suchen Koch, Küchenhilfe, Service und Schichtleitung (m/w/d), Voll- und Teilzeit.</p><p style="margin-top:12px"><a class="btn ghost" href="mailto:${DATA.mail}?subject=Bewerbung">Jetzt bewerben</a></p></div></div>`);

/* Bewertung */
wrap("review", `<div class="rating"><div class="stars" aria-label="4,5 von 5 Sternen">★★★★★</div>
  <h2>4,5 von 5 bei Google</h2>
  <p>Mehr als 2.700 Bewertungen. Gäste loben die großen Portionen, Flammkuchen und Käsespätzle, das gut gezapfte Bier und das freundliche Team.</p></div>`);

/* Reservierung (Vorschau: öffnet das Mailprogramm) */
wrap("reservation-section", `<h2>Tisch anfragen</h2><p class="lead">Für größere Gruppen. Wir melden uns per E-Mail oder Telefon zurück, die Anfrage ist noch keine feste Reservierung.</p>
  <form id="res-form">
    <div class="row">
      <label>Datum<input type="date" name="datum" required></label>
      <label>Uhrzeit<input type="time" name="zeit" min="12:00" max="22:00" value="18:00" required></label>
      <label>Personen<input type="number" name="personen" min="1" max="60" value="6" required></label>
    </div>
    <label>Name<input type="text" name="name" autocomplete="name" required></label>
    <div class="row" style="grid-template-columns:1fr">
      <label>Telefon oder E-Mail<input type="text" name="kontakt" required></label>
    </div>
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
    // Kein Server (z. B. reines Webhosting): Anfrage per Mailprogramm
    const body = [`Datum: ${data.datum}`, `Uhrzeit: ${data.zeit}`, `Personen: ${data.personen}`, `Name: ${data.name}`, `Kontakt: ${data.kontakt}`, `Anmerkung: ${data.text || "-"}`].join("\n");
    location.href = `mailto:${DATA.mail}?subject=${encodeURIComponent("Tischanfrage " + data.datum)}&body=${encodeURIComponent(body)}`;
    msg.textContent = "Dein Mailprogramm öffnet sich. Die Anfrage ist erst verschickt, wenn du sie dort absendest.";
  }
  btn.disabled = false;
});

/* Kontakt und Fuß */
wrap("kontakt", `<h2>So erreichst du uns</h2><div class="two" style="margin-top:16px">
  <address><p><b>Gaststätte Stövchen</b><br>Waldstraße 54<br>76133 Karlsruhe</p>
  <p style="margin-top:12px"><a href="tel:${DATA.telLink}">${DATA.tel}</a><br><a href="mailto:${DATA.mail}">${DATA.mail}</a></p></address>
  <div><a class="btn" href="https://www.google.com/maps/search/?api=1&query=Gaststätte+Stövchen+Waldstraße+54+Karlsruhe" target="_blank" rel="noopener">Route in Google Maps</a>
  <p class="note">Die Karte öffnet sich in einem neuen Tab, es werden vorher keine Daten an Google übertragen.</p></div></div>`);
$("site-footer").innerHTML = `<a href="#impressum">Impressum</a><a href="#datenschutz">Datenschutz</a>
  <a href="https://www.instagram.com/stoevchen_karlsruhe/" rel="noopener">Instagram</a><a href="https://de-de.facebook.com/stoevchen.karlsruhe/" rel="noopener">Facebook</a>
  <p>© ${new Date().getFullYear()} Gaststätte Stövchen, Waldstraße 54, 76133 Karlsruhe</p>`;
