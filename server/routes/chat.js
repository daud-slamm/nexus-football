const express = require('express');
const Groq = require('groq-sdk');
const { messages } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Eres NEXUS FOOTBALL, el asistente de inteligencia artificial más completo del mundo especializado EXCLUSIVAMENTE en fútbol.

Tienes conocimiento enciclopédico sobre:
- Todos los jugadores históricos y actuales (estadísticas, trayectorias, palmarés, récords personales)
- Competiciones: Champions League, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Copa del Mundo, Eurocopa, Copa América, etc.
- Máximos goleadores históricos y por temporada de TODAS las competiciones
- Balón de Oro: todos los ganadores históricos con sus estadísticas ese año
- Récords mundiales: goles, asistencias, partidos, títulos, rachas
- Entrenadores legendarios y sus sistemas tácticos
- Clubes: historia, títulos, estadios, figuras históricas
- Transferencias más caras, salarios, curiosidades del fútbol
- Reglas del fútbol y decisiones arbitrales

REGLAS ESTRICTAS:
1. SOLO respondes preguntas relacionadas con el fútbol. Si te preguntan algo ajeno al fútbol, responde amablemente: "⚽ Solo puedo responder preguntas sobre fútbol. ¡Pregúntame lo que quieras sobre el deporte rey!"
2. Siempre respondes en el idioma del usuario.
3. Usas emojis de fútbol con moderación para hacer las respuestas más dinámicas (⚽ 🏆 🥇 👟 etc.)
4. Cuando das estadísticas, las presentas de forma clara con tablas o listas.
5. CONOCIMIENTO ACTUALIZADO: Tu conocimiento llega hasta principios de 2024. Hoy estamos en 2025-2026. Por tanto:
   - NUNCA digas que algo "va a pasar" si ya ocurrió antes de 2024.
   - Si te preguntan por eventos de 2024 o 2025 en adelante, sé HONESTO: di claramente "⚠️ Mi conocimiento llega hasta principios de 2024, por lo que no tengo información verificada sobre este evento. Te recomiendo consultar una fuente actualizada como Google, ESPN o Transfermarkt."
   - NUNCA inventes resultados, fichajes, campeones o estadísticas recientes que no conozcas con certeza.
   - Para datos históricos (antes de 2024) sí puedes responder con total confianza.
6. Eres apasionado del fútbol y transmites esa energía en tus respuestas.`;

router.get('/conversations', authMiddleware, async (req, res) => {
  const all = await messages.find({ user_id: req.user.id }).sort({ created_at: 1 });

  const convMap = new Map();
  for (const m of all) {
    if (!convMap.has(m.conversation_id)) {
      convMap.set(m.conversation_id, {
        conversation_id: m.conversation_id,
        started_at: m.created_at,
        message_count: 0,
        first_message: m.role === 'user' ? m.content : null,
      });
    }
    const c = convMap.get(m.conversation_id);
    c.message_count++;
    if (!c.first_message && m.role === 'user') c.first_message = m.content;
  }

  const convos = Array.from(convMap.values())
    .sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
    .slice(0, 20);

  res.json(convos);
});

router.get('/history/:conversationId', authMiddleware, async (req, res) => {
  const msgs = await messages
    .find({ user_id: req.user.id, conversation_id: req.params.conversationId })
    .sort({ created_at: 1 });
  res.json(msgs.map(m => ({ role: m.role, content: m.content, created_at: m.created_at })));
});

router.post('/message', authMiddleware, async (req, res) => {
  const { message, conversationId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  const convId = conversationId || `conv_${Date.now()}_${req.user.id}`;

  const history = await messages
    .find({ user_id: req.user.id, conversation_id: convId })
    .sort({ created_at: 1 });

  const apiMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-40).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message.trim() },
  ];

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: apiMessages,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const assistantReply = response.choices[0].message.content;

    await messages.insert({ user_id: req.user.id, role: 'user', content: message.trim(), conversation_id: convId, created_at: new Date().toISOString() });
    await messages.insert({ user_id: req.user.id, role: 'assistant', content: assistantReply, conversation_id: convId, created_at: new Date(Date.now() + 1).toISOString() });

    res.json({ reply: assistantReply, conversationId: convId });
  } catch (err) {
    console.error('Error Groq API:', err.message);
    res.status(500).json({ error: 'Error al conectar con la IA. Verifica tu API key de Groq.' });
  }
});

router.delete('/conversation/:conversationId', authMiddleware, async (req, res) => {
  await messages.remove({ user_id: req.user.id, conversation_id: req.params.conversationId }, { multi: true });
  res.json({ ok: true });
});

module.exports = router;
