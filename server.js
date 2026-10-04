const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "20kb" }));

// Nur diese Dateien sind öffentlich. data/ mit den Anfragen bleibt privat.
const send = (f) => (req, res) => res.sendFile(path.join(__dirname, f));
app.get("/", send("index.html"));
app.get("/style.css", send("style.css"));
app.get("/script.js", send("script.js"));
app.use("/bilder", express.static(path.join(__dirname, "bilder")));

// Einfaches Limit: 5 Anfragen pro IP und Stunde
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 3600e3);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

app.post("/api/reservierung", async (req, res) => {
  if (limited(req.ip)) return res.status(429).json({ error: "Zu viele Anfragen" });
  const b = req.body || {};
  const s = (v, max) => String(v ?? "").trim().slice(0, max);
  const r = {
    datum: s(b.datum, 10), zeit: s(b.zeit, 5), personen: parseInt(b.personen, 10),
    name: s(b.name, 100), kontakt: s(b.kontakt, 120), text: s(b.text, 500),
    eingang: new Date().toISOString(),
  };
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(r.datum) && /^\d{2}:\d{2}$/.test(r.zeit) &&
    r.personen >= 1 && r.personen <= 60 && r.name && r.kontakt;
  if (!ok) return res.status(400).json({ error: "Ungültige Angaben" });

  try {
    const dir = path.join(__dirname, "data");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "reservierungen.json");
    const all = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
    all.push(r);
    fs.writeFileSync(file, JSON.stringify(all, null, 2));
  } catch (e) {
    console.error("Speichern fehlgeschlagen:", e.message);
  }

  // E-Mail nur, wenn SMTP-Zugang in den Umgebungsvariablen steht
  if (process.env.SMTP_HOST) {
    try {
      const t = require("nodemailer").createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await t.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.MAIL_TO || "mail@stoevchen.com",
        subject: `Tischanfrage ${r.datum}, ${r.personen} Personen`,
        text: `Datum: ${r.datum}\nUhrzeit: ${r.zeit}\nPersonen: ${r.personen}\nName: ${r.name}\nKontakt: ${r.kontakt}\nAnmerkung: ${r.text || "-"}`,
      });
    } catch (e) {
      console.error("Mailversand fehlgeschlagen:", e.message);
    }
  }
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("Stövchen-Seite läuft"));
