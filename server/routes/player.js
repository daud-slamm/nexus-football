const express = require('express');
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/player/search
router.post('/search', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' });

  const prompt = `Eres una base de datos de fútbol. Devuelve SOLO un JSON válido (sin texto extra, sin markdown) con esta estructura exacta sobre el jugador "${name}":
{
  "name": "nombre completo",
  "nickname": "apodo o nombre conocido",
  "nationality": "nacionalidad",
  "flag": "emoji bandera",
  "born": "fecha nacimiento (año)",
  "position": "posición",
  "height": "altura en cm",
  "current_club": "club actual o último club",
  "career": [{"club": "nombre", "years": "2010-2015", "apps": 120, "goals": 45}],
  "stats": {"goals": 0, "assists": 0, "trophies": 0, "caps": 0},
  "trophies": ["trofeo1", "trofeo2"],
  "ballon_dor": 0,
  "description": "descripción breve de 2 frases sobre su estilo y legado",
  "peak_year": "año de mejor momento",
  "known_for": ["característica1", "característica2", "característica3"]
}
Si el jugador no existe o no es de fútbol, devuelve: {"error": "Jugador no encontrado"}`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.1,
    });
    const text = response.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: 'No se pudo procesar la respuesta' });
    const data = JSON.parse(jsonMatch[0]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar jugador: ' + err.message });
  }
});

// POST /api/player/compare
router.post('/compare', authMiddleware, async (req, res) => {
  const { player1, player2 } = req.body;
  if (!player1?.trim() || !player2?.trim()) return res.status(400).json({ error: 'Se necesitan dos jugadores' });

  const prompt = `Eres una base de datos de fútbol. Devuelve SOLO un JSON válido (sin texto extra, sin markdown) comparando "${player1}" vs "${player2}":
{
  "player1": {
    "name": "nombre completo", "flag": "emoji bandera", "position": "posición",
    "current_club": "club", "goals": 0, "assists": 0, "trophies": 0,
    "ballon_dor": 0, "caps": 0, "champions": 0, "world_cups": 0,
    "peak": "año mejor momento", "style": "descripción estilo en 1 frase",
    "strengths": ["fortaleza1", "fortaleza2", "fortaleza3"]
  },
  "player2": {
    "name": "nombre completo", "flag": "emoji bandera", "position": "posición",
    "current_club": "club", "goals": 0, "assists": 0, "trophies": 0,
    "ballon_dor": 0, "caps": 0, "champions": 0, "world_cups": 0,
    "peak": "año mejor momento", "style": "descripción estilo en 1 frase",
    "strengths": ["fortaleza1", "fortaleza2", "fortaleza3"]
  },
  "verdict": "veredicto final objetivo en 2 frases sobre quién destaca en qué aspecto"
}`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.1,
    });
    const text = response.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: 'No se pudo procesar la respuesta' });
    const data = JSON.parse(jsonMatch[0]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al comparar jugadores: ' + err.message });
  }
});

module.exports = router;
