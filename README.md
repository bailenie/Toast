# 摸鱼圈 (MoyuCircle)

> 职场摸鱼社交网站 | 带薪划水的快乐老家

## 技术栈

- **前端**: React 19 + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express + TypeScript + Prisma + SQLite
- **实时通信**: Socket.io
- **身份认证**: JWT + bcrypt

## 快速开始

### 环境要求

- Node.js >= 18
- npm

### 安装依赖

```bash
# 前端
cd client
npm install

# 后端
cd server
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 初始化数据库

```bash
cd server
npx prisma migrate dev --name init
```

### 启动开发服务器

```bash
# 后端 (端口 3001)
cd server
npm run dev

# 前端 (端口 3000)
cd client
npm run dev
```

## 项目结构

```
摸鱼圈/
├── client/              # 前端 (React 19 + Vite 6 + Tailwind CSS 4)
├── server/              # 后端 (Node.js + Express + Prisma + SQLite)
├── specs/               # 项目文档
├── .env.example         # 环境变量示例
├── .gitignore           # Git 忽略规则
└── README.md            # 本文件
```

## 功能模块

- **用户系统**: 注册、登录、个人信息管理
- **蛐蛐蛐**: 实时聊天（5分钟消息销毁）
- **摸鱼鱼**: UNO 卡片收集、宠物鱼养成
- **窝囊费**: 实时工资计算器
- **鱼圈管理**: 创建/加入鱼圈、成员管理
- **老板键**: Esc 一键伪装（在线表格）
- **管理后台**: 用户管理、数据统计

## 开发规范

详见 `specs/开发规范.md`

## 许可证

MIT
