const userSockets = new Map(); // userId -> socketId

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(userId);
      userSockets.set(userId, socket.id);
      console.log(`👤 User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      // Remove from map
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });
};

// Helper function to send notification to a specific user
export const sendNotification = (io, userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};
