import { createUserSession } from './models/UserSession';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', async (data) => {
      const { userId, page } = data;
      await createUserSession(userId, page);
      const count = await pool.query('SELECT COUNT(*) FROM user_sessions');
      io.emit('userCount', count.rows[0].count);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
