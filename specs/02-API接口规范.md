# API 接口规范

> 版本：v1.0
> 日期：2026-06-11
> 归属：摸鱼圈开发规范
> 技术栈：Express 4 + TypeScript + Socket.io

---

## 1. 接口路径规范

### 1.1 路径前缀

| 端 | 前缀 | 示例 |
|---|------|------|
| 用户端 API | `/api/` | `/api/auth/login` |
| 管理后台 API | `/api/admin/` | `/api/admin/user/list` |

> 路由文件按模块拆分，挂载在 Express Router 中：
> - `server/src/routes/auth.routes.ts` → `/api/auth/*`
> - `server/src/routes/chat.routes.ts` → `/api/chat/*`
> - `server/src/routes/game.routes.ts` → `/api/game/*`
> - `server/src/routes/circle.routes.ts` → `/api/circle/*`
> - `server/src/routes/salary.routes.ts` → `/api/salary/*`
> - `server/src/routes/user.routes.ts` → `/api/user/*`
> - `server/src/routes/admin.routes.ts` → `/api/admin/*`

### 1.2 路径命名

```
# 资源型接口（RESTful）
GET    /api/circle                    # 获取当前用户鱼圈信息
GET    /api/circle/:id/members        # 获取鱼圈成员列表
POST   /api/circle                    # 创建鱼圈
POST   /api/circle/join               # 加入鱼圈（非标准动作用动作型）
DELETE /api/circle/leave              # 退出鱼圈

# 动作型接口
POST   /api/auth/register            # 注册
POST   /api/auth/login               # 登录
POST   /api/game/moyu                # 摸鱼抽卡
POST   /api/chat/send                # 发送消息

# 管理后台接口
GET    /api/admin/user/list           # 用户列表
PUT    /api/admin/user/:id/ban        # 禁用/启用用户
POST   /api/admin/circle/:id/dissolve # 强制解散鱼圈
```

### 1.3 路径命名规则

| 规则 | 说明 | 正确示例 | 错误示例 |
|------|------|---------|---------|
| 全小写 | 路径全部小写 | `/api/auth/login` | `/api/Auth/Login` |
| 短横线分隔 | 多单词用 `-` | `/api/circle/join-by-code` | `/api/circle/joinByCode` |
| 资源用名词 | CRUD 用名词 | `/api/user/profile` | `/api/getUserProfile` |
| 动作用动词 | 非 CRUD 动作 | `/api/game/moyu` | `/api/game` |

---

## 2. 请求规范

### 2.1 GET 请求

```typescript
// 查询参数（过滤、分页）
GET /api/admin/user/list?page=1&pageSize=20&keyword=张三

// 路径参数（资源标识）
GET /api/circle/circle_abc123/members
```

### 2.2 POST / PUT 请求

```typescript
// Content-Type: application/json
// POST /api/circle
{
  "name": "摸鱼小分队"
}

// POST /api/chat/send
{
  "circleId": "circle_abc123",
  "text": "今天又是努力当窝囊废的一天"
}
```

### 2.3 请求头

```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...   // JWT Token（需认证接口）
```

> **认证规则**：除 `/api/auth/register` 和 `/api/auth/login` 外，所有接口必须在请求头携带 JWT Token。通过 `server/src/middleware/auth.ts` 统一校验。

---

## 3. 响应规范

### 3.1 统一响应格式

所有 API 响应**必须**遵循以下两种格式：

```typescript
// 成功响应
interface ApiResponse<T> {
  success: true;
  data: T;
}

// 错误响应
interface ApiError {
  success: false;
  error: {
    code: string;      // 业务错误码，如 'CIRCLE_FULL'
    message: string;   // 用户友好的错误描述
  };
}
```

### 3.2 成功响应示例

```json
// 无数据
{
  "success": true,
  "data": null
}

// 单条数据
{
  "success": true,
  "data": {
    "id": "circle_abc123",
    "name": "摸鱼小分队",
    "inviteCode": "883201",
    "memberCount": 5
  }
}

// 列表数据
{
  "success": true,
  "data": {
    "items": [
      { "id": "user_001", "userName": "咸鱼小王", "avatar": "moyu_otter" },
      { "id": "user_002", "userName": "躺平老李", "avatar": "lazy_panda" }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

### 3.3 错误响应示例

```json
{
  "success": false,
  "error": {
    "code": "CIRCLE_FULL",
    "message": "这个划水小分队已经达到10人满负荷啦！"
  }
}
```

### 3.4 日期时间格式

所有 API 返回的日期时间字段，统一使用 **ISO 8601** 格式（Prisma 默认输出格式）：

```json
{
  "success": true,
  "data": {
    "createdAt": "2026-06-11T10:30:00.000Z"
  }
}
```

| 场景 | 格式 | 示例 |
|------|------|------|
| 带时间 | ISO 8601 | `2026-06-11T10:30:00.000Z` |
| 仅日期 | `yyyy-MM-dd` | `2026-06-11` |

> 前端渲染时根据用户本地时区格式化显示，服务端统一存储 UTC 时间。

---

## 4. 业务错误码

### 4.1 HTTP 状态码

| HTTP Status | 说明 |
|-------------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证（未登录或 Token 过期） |
| 403 | 无权限（已登录但无权操作） |
| 404 | 资源不存在 |
| 429 | 请求过于频繁（限流） |
| 500 | 服务器内部错误 |

### 4.2 业务错误码定义

#### 认证模块 (auth)

| 错误码 | HTTP Status | 说明 | 前端提示 |
|--------|-------------|------|---------|
| `AUTH_INVALID_CREDENTIALS` | 401 | 邮箱或密码错误 | 密码输入有误，请核实后再敲门！ |
| `AUTH_TOKEN_EXPIRED` | 401 | JWT Token 过期 | 登录已过期，请重新登录 |
| `AUTH_TOKEN_INVALID` | 401 | JWT Token 无效 | 认证信息无效 |
| `AUTH_EMAIL_EXISTS` | 400 | 邮箱已注册 | 该邮箱已在职场划水中！请尝试直接登录。 |
| `AUTH_WEAK_PASSWORD` | 400 | 密码少于6位 | 密码至少需要6位字符 |
| `AUTH_USER_NOT_FOUND` | 404 | 用户不存在 | 找不到该雇员信息，请确认邮箱或切换为注册页面！ |
| `AUTH_USER_BANNED` | 403 | 用户已被封禁 | 你已被管理员关进【冷冻鱼缸】！ |

#### 鱼圈模块 (circle)

| 错误码 | HTTP Status | 说明 | 前端提示 |
|--------|-------------|------|---------|
| `CIRCLE_NOT_FOUND` | 404 | 鱼圈不存在 | 找不到匹配的鱼圈！ |
| `CIRCLE_FULL` | 400 | 鱼圈已满（10人上限） | 这个划水小分队已经达到10人满负荷啦！ |
| `CIRCLE_ALREADY_MEMBER` | 400 | 已在该鱼圈中 | 你已经在这只划水队伍中啦！ |
| `CIRCLE_INVALID_CODE` | 400 | 邀请码无效 | 找不到匹配的鱼圈！请核对6位分享秘钥。 |
| `CIRCLE_PRIVATE_NO_EXIT` | 400 | 私有鱼圈不可退出 | 私有鱼圈是你永远的安全港湾~ |
| `CIRCLE_NO_PERMISSION` | 403 | 非群主无权操作 | 只有群主才能踢人哦！ |
| `CIRCLE_NAME_TOO_LONG` | 400 | 鱼圈名称超过50字符 | 名称超长，鱼圈名限50字以内哦~ |

#### 聊天模块 (chat)

| 错误码 | HTTP Status | 说明 | 前端提示 |
|--------|-------------|------|---------|
| `MESSAGE_TOO_LONG` | 400 | 消息超过500字符 | 内容超长，碎碎念不可超过500字！ |
| `MESSAGE_EMPTY` | 400 | 消息为空 | 消息内容不能为空哦~ |

#### 游戏模块 (game)

| 错误码 | HTTP Status | 说明 | 前端提示 |
|--------|-------------|------|---------|
| `MOYU_LIMIT_REACHED` | 400 | 今日摸鱼次数已达上限 | 你已触及今日防沉迷保护网！ |
| `MOYU_NOT_AVAILABLE` | 400 | 当前不可摸鱼 | 摸鱼功能暂未开放 |

#### 窝囊费模块 (salary)

| 错误码 | HTTP Status | 说明 | 前端提示 |
|--------|-------------|------|---------|
| `SALARY_INVALID_TIME` | 400 | 上班/下班时间格式错误 | 时间格式不正确，请使用 HH:mm 格式 |
| `SALARY_INVALID_RANGE` | 400 | 上班时间不早于下班时间 | 上班时间不能晚于下班时间 |

#### 管理后台模块 (admin)

| 错误码 | HTTP Status | 说明 | 前端提示 |
|--------|-------------|------|---------|
| `ADMIN_UNAUTHORIZED` | 401 | 管理员认证失败 | 管理员登录失败 |
| `ADMIN_FORBIDDEN` | 403 | 非管理员角色 | 无管理员权限 |

---

## 5. 用户端接口清单

### 5.1 认证模块 (`/api/auth`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/auth/register` | POST | 否 | 邮箱注册 |
| `/api/auth/login` | POST | 否 | 邮箱登录 |
| `/api/auth/logout` | POST | 是 | 登出 |
| `/api/auth/me` | GET | 是 | 获取当前用户信息 |

### 5.2 鱼圈管理模块 (`/api/circle`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/circle/current` | GET | 是 | 获取当前鱼圈信息 |
| `/api/circle` | POST | 是 | 创建鱼圈 |
| `/api/circle/join` | POST | 是 | 通过邀请码加入鱼圈 |
| `/api/circle/leave` | POST | 是 | 退出当前鱼圈 |
| `/api/circle/:id/members` | GET | 是 | 获取鱼圈成员列表 |
| `/api/circle/kick` | POST | 是 | 群主踢出成员 |

### 5.3 蛐蛐蛐聊天模块 (`/api/chat`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/chat/send` | POST | 是 | 发送消息（REST 入库） |

> **注意**：消息的实时收发通过 Socket.io 实现（见第 7 节），REST 接口仅用于消息持久化和初始加载。

### 5.4 摸鱼鱼游戏模块 (`/api/game`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/game/moyu` | POST | 是 | 执行摸鱼操作（抽卡+喂鱼） |
| `/api/game/cards` | GET | 是 | 获取用户卡片收藏 |
| `/api/game/stats` | GET | 是 | 获取摸鱼统计 |
| `/api/game/leaderboard` | GET | 是 | 获取鱼圈排行榜 |

### 5.5 窝囊费模块 (`/api/salary`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/salary/config` | GET | 是 | 获取窝囊费配置 |
| `/api/salary/config` | PUT | 是 | 更新窝囊费配置 |
| `/api/salary/today` | GET | 是 | 获取今日已赚窝囊费 |

### 5.6 用户中心模块 (`/api/user`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/user/profile` | GET | 是 | 获取个人资料 |
| `/api/user/profile` | PUT | 是 | 更新个人资料（昵称、头像） |
| `/api/user/avatars` | GET | 是 | 获取可用头像列表 |

---

## 6. 管理后台接口清单

### 6.1 管理员认证 (`/api/admin/auth`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/admin/auth/login` | POST | 否 | 管理员登录 |
| `/api/admin/auth/me` | GET | 管理员认证 | 获取管理员信息 |

### 6.2 用户管理 (`/api/admin/user`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/admin/user/list` | GET | 管理员认证 | 分页查询用户 |
| `/api/admin/user/:id` | GET | 管理员认证 | 用户详情 |
| `/api/admin/user/:id/ban` | PUT | 管理员认证 | 禁用/启用用户 |

### 6.3 鱼圈管理 (`/api/admin/circle`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/admin/circle/list` | GET | 管理员认证 | 分页查询鱼圈 |
| `/api/admin/circle/:id` | GET | 管理员认证 | 鱼圈详情 |
| `/api/admin/circle/:id/dissolve` | POST | 管理员认证 | 强制解散鱼圈 |

### 6.4 数据统计 (`/api/admin/stats`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/admin/stats/overview` | GET | 管理员认证 | 数据概览（用户数/鱼圈数/消息量） |
| `/api/admin/stats/moyu` | GET | 管理员认证 | 摸鱼数据统计 |
| `/api/admin/stats/trend` | GET | 管理员认证 | 趋势数据 |

### 6.5 系统配置 (`/api/admin/config`)

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/admin/config/game` | GET | 管理员认证 | 获取游戏参数 |
| `/api/admin/config/game` | PUT | 管理员认证 | 更新游戏参数 |

---

## 7. Socket.io 实时通信规范

### 7.1 连接认证

```typescript
// 客户端连接时携带 JWT Token
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiJ9...'
  }
});
```

### 7.2 事件列表

| 事件名 | 方向 | 载荷 | 说明 |
|--------|------|------|------|
| `join:circle` | Client → Server | `{ circleId: string }` | 加入鱼圈聊天房间 |
| `send:message` | Client → Server | `{ circleId, text }` | 发送聊天消息 |
| `leave:circle` | Client → Server | `{ circleId: string }` | 离开鱼圈聊天房间 |
| `receive:message` | Server → Client | `{ id, circleId, authorId, authorName, authorAvatar, text, createdAt }` | 接收新消息 |
| `destroy:message` | Server → Client | `{ messageId: string }` | 通知消息已过期销毁 |
| `user:joined` | Server → Client | `{ userId, userName }` | 某用户加入房间 |
| `user:left` | Server → Client | `{ userId, userName }` | 某用户离开房间 |

### 7.3 消息生命周期

```
发送消息 → Socket.io 广播到鱼圈房间 → 客户端显示
                                  ↓
                        5分钟后服务端定时器触发
                                  ↓
                        从数据库物理删除 → 广播 destroy:message → 客户端移除
```

### 7.4 错误事件

| 事件名 | 方向 | 载荷 | 说明 |
|--------|------|------|------|
| `connect_error` | Server → Client | `{ message: string }` | 连接/认证错误 |
| `error` | Server → Client | `{ code: string, message: string }` | 业务错误 |

---

## 8. 接口文档示例

### 8.1 用户注册

**请求**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "xiaowang@company.com",
  "password": "abc123456",
  "userName": "摸鱼小王",
  "avatar": "moyu_otter"
}
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "xiaowang@company.com",
      "userName": "摸鱼小王",
      "avatar": "moyu_otter",
      "privateCircleId": "private_abc123",
      "joinedCircleId": "private_abc123",
      "createdAt": "2026-06-11T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

**失败响应**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_EMAIL_EXISTS",
    "message": "该邮箱已在职场划水中！请尝试直接登录。"
  }
}
```

### 8.2 执行摸鱼

**请求**
```http
POST /api/game/moyu
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "circleId": "circle_abc123"
}
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "drawnCards": [
      {
        "id": "R_3",
        "name": "红色 3",
        "color": "Red",
        "value": "3",
        "rarity": "N",
        "bonusText": "带薪如厕第三分钟，世界突然安静了"
      }
    ],
    "todayCount": 12,
    "todayLimit": 35,
    "petFishExp": 65,
    "petFishLevel": 3
  }
}
```

**失败响应（达到上限）**
```json
{
  "success": false,
  "error": {
    "code": "MOYU_LIMIT_REACHED",
    "message": "你已触及今日防沉迷保护网！强制进入'高效装勤快'模式，明天早上见！"
  }
}
```

### 8.3 创建鱼圈

**请求**
```http
POST /api/circle
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "name": "市场部周五早退党"
}
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "id": "circle_xyz789",
    "name": "市场部周五早退党",
    "inviteCode": "451892",
    "memberCount": 1,
    "petFishName": "懵懂小红金鱼",
    "petFishLevel": 1
  }
}
```

---

## 9. 统一响应封装（TypeScript）

### 9.1 响应工具函数

```typescript
// server/src/utils/response.ts
import type { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export function sendSuccess<T>(res: Response, data: T): void {
  res.json({ success: true, data });
}

export function sendError(res: Response, statusCode: number, code: string, message: string): void {
  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}
```

### 9.2 使用示例

```typescript
import { sendSuccess, sendError } from '../utils/response';

// 注册接口
router.post('/register', async (req, res) => {
  const { email, password, userName, avatar } = req.body;

  // 参数校验
  if (!email || !password || !userName) {
    return sendError(res, 400, 'INVALID_PARAMS', '邮箱、密码和昵称不能为空');
  }

  try {
    const user = await authService.register({ email, password, userName, avatar });
    sendSuccess(res, { user, token: user.token });
  } catch (err) {
    if (err.code === 'EMAIL_EXISTS') {
      sendError(res, 400, 'AUTH_EMAIL_EXISTS', '该邮箱已在职场划水中！请尝试直接登录。');
    } else {
      sendError(res, 500, 'INTERNAL_ERROR', '服务器内部错误');
    }
  }
});
```

---

*文档版本：v1.0*
*最后更新：2026-06-11*
*适用项目：摸鱼圈 (MoyuCircle)*
