import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authRouter } from './routes/auth.routes.js';
import { homeRouter } from './routes/home.routes.js';
import { circlesRouter } from './routes/circles.js';
import { moyuRouter } from './routes/moyu.js';
import { salaryRouter } from './routes/salary.js';
import { signRouter } from './routes/sign.js';
import { decorationsRouter } from './routes/decorations.js';
import { initSocket } from './socket.js';
import { startInviteCleanup } from './services/inviteCleanup.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: '摸鱼圈服务器运行中 🐟' });
});

// 认证路由
app.use('/api/auth', authRouter);

// 首页路由
app.use('/api/home', homeRouter);

// 鱼圈管理路由
app.use('/api/circles', circlesRouter);

// 签到路由
app.use('/api/circles', signRouter);

// 装饰路由
app.use('/api/decorations', decorationsRouter);
app.use('/api/circles', decorationsRouter);

// 摸鱼游戏路由
app.use('/api/moyu', moyuRouter);

// 窝囊费路由
app.use('/api/salary', salaryRouter);

// 初始化 Socket.io
initSocket(io);

// 启动邀请码清理服务
startInviteCleanup();

// 启动服务器
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🐟 摸鱼圈服务器启动成功: http://localhost:${PORT}`);
});

export { app, io };
