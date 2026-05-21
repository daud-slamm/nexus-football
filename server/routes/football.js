const express = require('express');
const fetch = require('node-fetch');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const BASE = 'https://api.football-data.org/v4';
const HEADERS = { 'X-Auth-Token': process.env.FOOTBALL_API_KEY };

// Simple in-memory cache to respect rate limit (10 req/min)
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

async function apiFetch(path) {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;

  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });

  // Check rate limit headers
  const remaining = res.headers.get('X-Requests-Available-Minute');
  if (remaining && parseInt(remaining) < 2) {
    console.warn('Football API rate limit nearly reached');
  }

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  cache.set(path, { data, time: Date.now() });
  return data;
}

const COMPETITIONS = {
  CL:  { name: 'Champions League', flag: '🏆' },
  PL:  { name: 'Premier League',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  PD:  { name: 'La Liga',          flag: '🇪🇸' },
  BL1: { name: 'Bundesliga',       flag: '🇩🇪' },
  SA:  { name: 'Serie A',          flag: '🇮🇹' },
  FL1: { name: 'Ligue 1',          flag: '🇫🇷' },
};

// GET /api/football/competitions
router.get('/competitions', authMiddleware, (req, res) => {
  res.json(Object.entries(COMPETITIONS).map(([code, info]) => ({ code, ...info })));
});

// GET /api/football/standings/:code
router.get('/standings/:code', authMiddleware, async (req, res) => {
  const code = req.params.code.toUpperCase();
  if (!COMPETITIONS[code]) return res.status(400).json({ error: 'Competición no válida' });
  try {
    const data = await apiFetch(`/competitions/${code}/standings`);
    const table = data.standings?.find(s => s.type === 'TOTAL')?.table || [];
    res.json({
      competition: COMPETITIONS[code],
      season: data.season,
      table: table.map(row => ({
        position: row.position,
        team: row.team.name,
        crest: row.team.crest,
        played: row.playedGames,
        won: row.won,
        draw: row.draw,
        lost: row.lost,
        gf: row.goalsFor,
        ga: row.goalsAgainst,
        gd: row.goalDifference,
        points: row.points,
        form: row.form,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clasificación: ' + err.message });
  }
});

// GET /api/football/matches/:code
router.get('/matches/:code', authMiddleware, async (req, res) => {
  const code = req.params.code.toUpperCase();
  if (!COMPETITIONS[code]) return res.status(400).json({ error: 'Competición no válida' });
  try {
    const data = await apiFetch(`/competitions/${code}/matches?status=SCHEDULED&limit=10`);
    const matches = (data.matches || []).slice(0, 10).map(m => ({
      id: m.id,
      date: m.utcDate,
      home: { name: m.homeTeam.name, crest: m.homeTeam.crest },
      away: { name: m.awayTeam.name, crest: m.awayTeam.crest },
      status: m.status,
      score: m.score,
      matchday: m.matchday,
    }));
    res.json({ competition: COMPETITIONS[code], matches });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener partidos: ' + err.message });
  }
});

// GET /api/football/scorers/:code
router.get('/scorers/:code', authMiddleware, async (req, res) => {
  const code = req.params.code.toUpperCase();
  if (!COMPETITIONS[code]) return res.status(400).json({ error: 'Competición no válida' });
  try {
    const data = await apiFetch(`/competitions/${code}/scorers?limit=10`);
    const scorers = (data.scorers || []).map((s, i) => ({
      position: i + 1,
      player: s.player.name,
      nationality: s.player.nationality,
      team: s.team.name,
      crest: s.team.crest,
      goals: s.goals,
      assists: s.assists || 0,
      penalties: s.penalties || 0,
    }));
    res.json({ competition: COMPETITIONS[code], season: data.season, scorers });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener goleadores: ' + err.message });
  }
});

// GET /api/football/results/:code — últimos partidos jugados
router.get('/results/:code', authMiddleware, async (req, res) => {
  const code = req.params.code.toUpperCase();
  if (!COMPETITIONS[code]) return res.status(400).json({ error: 'Competición no válida' });
  try {
    const data = await apiFetch(`/competitions/${code}/matches?status=FINISHED&limit=10`);
    const matches = (data.matches || []).slice(-10).reverse().map(m => ({
      id: m.id,
      date: m.utcDate,
      home: { name: m.homeTeam.name, crest: m.homeTeam.crest },
      away: { name: m.awayTeam.name, crest: m.awayTeam.crest },
      score: { home: m.score?.fullTime?.home, away: m.score?.fullTime?.away },
      matchday: m.matchday,
    }));
    res.json({ competition: COMPETITIONS[code], matches });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resultados: ' + err.message });
  }
});

module.exports = router;
