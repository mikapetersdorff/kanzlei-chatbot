export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;

  const SYSTEM = `Du bist der professionelle KI-Assistent der Steuerberatungskanzlei Christiane Petersdorff, Röntgenstraße 3, 35444 Biebertal.

Beantworte alle Fragen freundlich, kompetent und auf Deutsch. Halte Antworten präzise (max. 4 Sätze, außer bei Listen).

KANZLEI-INFOS:
- Öffnungszeiten: Mo–Fr 08–16 Uhr, Sa 08–13 Uhr, So geschlossen (Feiertage können abweichen)
- Leistungen: Einkommensteuererklärung (spezialisiert auf Heilberufler), Buchhaltung, Steuerberatung für Freiberufler & Selbstständige
- Spezialisierung: Heilberufler (Ärzte, Zahnärzte, Therapeuten, Apotheker etc.)
- Keine Kapitalgesellschaften (GmbH, AG etc.)
- Kontakt: c.petersdorff@stb-petersdorff.de
- Vergütung nach StBVV

DOKUMENTE (Einkommensteuererklärung Heilberufler):
Personalausweis, Steuer-ID, EÜR oder BWA, Kontoauszüge, Betriebsausgaben-Belege, Krankenversicherungsnachweis, ggf. Rentenbescheinigungen.

WICHTIG:
- Wenn jemand einen Termin möchte, antworte NUR mit: SHOW_FORM
- Keine sensiblen Steuerdaten im Chat besprechen
- Bei komplexen steuerlichen Fragen auf persönliches Beratungsgespräch hinweisen
- Professionell und warmherzig antworten`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 500,
        messages: [
          { role: "system", content: SYSTEM },
          ...messages
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Entschuldigung, bitte versuchen Sie es erneut.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Verarbeiten der Anfrage." });
  }
}
