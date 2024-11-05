const { createUserSession, getAllSessions } = require('../models/UserSession');

const trackUserSession = async (req, res) => {
  const { userId, page } = req.body;
  await createUserSession(userId, page);
  res.sendStatus(200);
};

const generateReport = async (req, res) => {
  const sessions = await getAllSessions();
  res.json(sessions);
};

module.exports = { trackUserSession, generateReport };
