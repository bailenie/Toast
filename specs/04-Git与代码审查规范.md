# Git 使用规范 & 代码审查流程

> 版本：v1.0
> 日期：2026-06-11
> 归属：摸鱼圈开发规范
> 适用团队：独立开发者 / 小团队

---

## 1. Git 分支管理

### 1.1 分支策略

采用 **简化 Trunk-Based** 开发模式（适合独立开发者 / 小团队）：

```
main ─────●────●────●────●────●────→
           \  /       \  /
        feat/chat   fix/auth-redirect
```

| 规则 | 说明 |
|------|------|
| **主分支** | `main`，始终处于可部署状态 |
| **功能分支** | `feat/*`，从 main 创建，完成后 Squash Merge 回 main |
| **修复分支** | `fix/*`，从 main 创建，完成后 Squash Merge 回 main |
| **合并方式** | **Squash Merge**，保持 main 分支历史整洁 |
| **禁止** | 直接 push 到 main |

> **为什么不选 Git Flow？** 项目是独立开发者 / 小团队，没有 release 分支和 hotfix 分支的复杂需求。简单的 Trunk-Based + Squash Merge 足够，且更利于代码审查和历史回溯。

### 1.2 分支命名规范

```
<type>/<short-description>
```

| 类型 | 用途 | 示例 |
|------|------|------|
| `feat/` | 新功能 | `feat/chat-room`, `feat/card-collection` |
| `fix/` | Bug 修复 | `fix/auth-redirect`, `fix/message-overflow` |
| `refactor/` | 重构 | `refactor/socket-events`, `refactor/prisma-schema` |
| `docs/` | 文档 | `docs/api-spec`, `docs/dev-setup` |
| `chore/` | 构建/配置/依赖 | `chore/eslint-setup`, `chore/upgrade-prisma` |

### 1.3 分支操作流程

```bash
# 1. 从 main 创建功能分支
git checkout main
git pull origin main
git checkout -b feat/chat-room

# 2. 开发、提交（多次提交）
git add src/components/chat/
git commit -m "feat(chat): 实现聊天室主界面"

# 3. 推送到远程
git push origin feat/chat-room

# 4. 在 GitHub/GitLab 创建 PR/MR，请求审查
# 5. 审查通过后，Squash Merge 到 main

# 6. 删除远程功能分支
git checkout main
git pull origin main
git branch -d feat/chat-room
git push origin --delete feat/chat-room
```

---

## 2. Commit 提交规范

### 2.1 提交信息格式

```
<type>(<scope>): <subject>

[body]

[footer]
```

### 2.2 Type 类型

| type | 说明 | 使用场景 |
|------|------|---------|
| `feat` | 新功能 | 新增功能模块、接口、页面 |
| `fix` | Bug 修复 | 修复缺陷、错误行为 |
| `docs` | 文档变更 | 修改 README、注释、API 文档 |
| `style` | 代码格式 | 格式化代码，不影响逻辑 |
| `refactor` | 重构 | 重构代码，不新增功能不修 bug |
| `perf` | 性能优化 | 提升性能 |
| `test` | 测试相关 | 添加/修改测试用例 |
| `chore` | 构建/工具 | 修改构建脚本、工具配置、依赖升级 |

### 2.3 Scope 范围

从摸鱼圈业务模块中提取：

| scope | 对应范围 |
|-------|---------|
| `auth` | 认证模块（注册、登录、JWT） |
| `chat` | 蛐蛐蛐聊天系统 |
| `game` | 摸鱼鱼游戏系统（卡片、宠物鱼） |
| `salary` | 窝囊费系统 |
| `circle` | 鱼圈管理 |
| `boss` | 老板键伪装系统 |
| `admin` | 管理后台 |
| `user` | 用户中心 |
| `common` | 通用组件、共享工具 |

### 2.4 提交信息规则

| 规则 | 要求 |
|------|------|
| **subject 语言** | 使用**中文** |
| **subject 长度** | 不超过 50 个字符 |
| **subject 格式** | 不以句号结尾，使用祈使语气 |
| **body** | 解释**为什么**做这个变更，不是做了什么 |
| **footer** | 关联 Issue，如 `Closes #12` 或 `Fixes #45` |
| **原子提交** | 一个提交只做一件事 |

### 2.5 提交信息示例

```bash
feat(chat): 实现消息发送与实时接收

- 集成 Socket.io 客户端，建立 WebSocket 连接
- 实现消息发送、接收、自动滚动
- 消息 5 分钟自动销毁定时器
- 单条消息 500 字符限制校验

Closes #12
```

```bash
fix(auth): 修复 JWT 过期后页面白屏问题

- Token 过期时自动清除本地存储并跳转登录页
- 添加 401 响应拦截器统一处理
- 避免过期 token 重复请求导致死循环

Fixes #34
```

```bash
refactor(game): 重构卡片掉落概率逻辑

- 将概率配置从硬编码迁移到 SystemConfig 表
- 支持管理后台动态调整掉落率
- 保持原有掉落行为不变
```

---

## 3. Pull Request 规范

### 3.1 PR 创建流程

```
开发代码 → 推送分支 → 创建 PR → 代码审查 → 合并到 main → 删除分支
```

### 3.2 PR 标题规范

```
{type}: {简短描述}

示例：
feat: 实现蛐蛐蛐聊天系统
fix: 修复登录过期白屏问题
docs: 更新 API 接口文档
```

### 3.3 PR 描述模板

```markdown
## 变更描述
<!-- 简要说明本次变更做了什么，为什么做 -->

## 变更类型
- [ ] 新功能 (feat)
- [ ] Bug 修复 (fix)
- [ ] 重构 (refactor)
- [ ] 文档 (docs)
- [ ] 其他

## 变更范围
<!-- 影响的模块或文件，如 "chat 模块的 ChatRoom.tsx 和 useChat.ts" -->

## 测试情况
- [ ] 本地测试通过
- [ ] 核心流程手动验证
- [ ] 无影响，无需测试

## 截图/录屏
<!-- UI 变更请提供截图 -->

## Checklist
- [ ] TypeScript 编译无错误
- [ ] ESLint 检查通过
- [ ] 无硬编码敏感信息
- [ ] 关键业务逻辑有注释
- [ ] 新增类型使用 `import type`

## 关联 Issue
Closes #123
```

---

## 4. Code Review 流程

### 4.1 Review 检查清单

#### 代码规范

- [ ] 符合命名规范（PascalCase 组件、camelCase 函数/变量）
- [ ] 无硬编码（配置值、魔法数字、URL）
- [ ] 无重复代码（DRY 原则）
- [ ] 代码简洁可读
- [ ] 无 `any`、非空断言、`@ts-ignore`
- [ ] 样式仅使用 Tailwind CSS 类名

#### 功能逻辑

- [ ] 满足需求描述
- [ ] 边界条件处理（空值、空数组、空字符串）
- [ ] 异常情况处理（try-catch、错误提示）
- [ ] 返回值合理（遵循统一响应格式）
- [ ] 业务规则正确实现

#### 安全性

- [ ] 用户输入已校验
- [ ] 使用 Prisma 参数化查询（禁止 SQL 拼接）
- [ ] XSS 防护（禁止 `dangerouslySetInnerHTML`）
- [ ] JWT 认证已校验（受保护接口使用 auth 中间件）
- [ ] 敏感信息未硬编码

#### 性能

- [ ] Prisma 查询合理（无 N+1 问题）
- [ ] 避免不必要的重渲染（React.memo / useMemo）
- [ ] 没有无限循环的 useEffect
- [ ] 大列表使用分页或虚拟滚动

#### 架构一致性

- [ ] 路由在对应 `routes/` 文件中定义
- [ ] 业务逻辑在 `services/` 中，不在路由中
- [ ] 自定义 Hook 在 `hooks/` 目录
- [ ] 组件按模块放在 `components/<模块>/` 下
- [ ] 不违反模块依赖方向（如 common 不依赖业务模块）

### 4.2 Review 注释规范

使用以下标签标记评论类型：

| 标签 | 含义 | 是否阻塞合并 |
|------|------|-------------|
| `[blocker]` | 必须修改 | 是 |
| `[major]` | 强烈建议修改 | 建议修改 |
| `[minor]` | 小问题，可选修改 | 否 |
| `[nitpick]` | 代码风格偏好 | 否 |
| `[praise]` | 值得表扬 | 否 |

**示例**：

```markdown
[blocker] 这里使用了 `any` 类型，会导致运行时错误，请添加正确的类型标注

[major] 建议将这个 500 字符限制提取为常量 `MAX_MESSAGE_LENGTH`，避免多处硬编码

[minor] 这个变量名可以更语义化，`d` → `messageData`

[praise] 这个错误处理逻辑写得很清晰，用户体验考虑周到
```

### 4.3 Review 响应规范

| 状态 | 说明 |
|------|------|
| **Approved** | 审核通过，可以合并 |
| **Request Changes** | 需要修改后重新审核 |
| **Comment** | 仅评论，不阻塞合并 |

---

## 5. Git 配置

### 5.1 用户配置

```bash
# 设置用户名和邮箱
git config user.name "你的名字"
git config user.email "your-email@company.com"
```

### 5.2 别名配置

```bash
git config alias.st "status -s"
git config alias.lg "log --oneline --graph --decorate -10"
git config alias.last "log -1 HEAD"
git config alias.co "checkout"
git config alias.br "branch"
```

### 5.3 忽略文件

```gitignore
# 依赖
node_modules/

# 环境变量（含敏感信息）
.env
.env.local
.env.*.local

# 构建产物
dist/
build/
.vite/

# SQLite 数据库文件
*.db
*.db-journal
*.db-wal

# IDE
.idea/
.vscode/
*.iml

# 操作系统
.DS_Store
Thumbs.db

# 日志
*.log
logs/

# Prisma
prisma/dev.db

# 敏感文件
*.pem
credentials.json
```

---

## 6. 常用 Git 命令速查

### 6.1 分支操作

```bash
# 查看所有分支
git branch -a

# 创建并切换到新分支
git checkout -b feat/xxx

# 切换分支
git checkout main

# 删除本地分支
git branch -d feat/xxx

# 删除远程分支
git push origin --delete feat/xxx
```

### 6.2 提交操作

```bash
# 查看状态
git status

# 添加特定文件（推荐）
git add src/components/chat/ChatRoom.tsx src/hooks/useChat.ts

# 提交
git commit -m "feat(chat): 添加聊天消息组件"

# 修改最后一次提交
git commit --amend

# 查看提交历史
git log --oneline -10
```

### 6.3 撤销操作

```bash
# 撤销工作区修改
git checkout -- file

# 撤销暂存
git reset HEAD file

# 回退提交（保留修改）
git reset --soft HEAD~1

# 回退提交（丢弃修改，慎用）
git reset --hard HEAD~1
```

---

## 7. 冲突处理

### 7.1 预防冲突

1. **频繁拉取**：每天开始工作前 `git pull origin main`
2. **小步提交**：频繁提交，避免大量变更
3. **及时合并**：功能开发完成后尽快创建 PR

### 7.2 解决冲突

```bash
# 1. 拉取最新的 main
git checkout main
git pull origin main

# 2. 切回功能分支，合并 main
git checkout feat/xxx
git merge main

# 3. 解决冲突后
git add .
git commit -m "merge: 解决与 main 的冲突"

# 4. 推送
git push origin feat/xxx
```

### 7.3 冲突标记解读

```
<<<<<<< HEAD
当前分支的代码
=======
被合并分支的代码
>>>>>>> main
```

---

## 8. 发布流程

### 8.1 版本号规范

```
v{主版本}.{次版本}.{修订版本}

示例：
v1.0.0 - 首发版本
v1.0.1 - 修订版本（bug 修复）
v1.1.0 - 次版本（新功能）
v2.0.0 - 主版本（重大变更）
```

### 8.2 打标签

```bash
# 创建标签
git tag -a v1.0.0 -m "摸鱼圈 v1.0.0 - MVP 正式发布"

# 推送标签
git push origin v1.0.0

# 查看所有标签
git tag -l
```

### 8.3 版本发布流程

```
1. 确认 main 分支所有 PR 已合并
2. 运行完整测试（如有）
3. 更新版本号（package.json）
4. 打 Git 标签
5. 推送标签到远程
6. 触发部署（Vercel / Railway 自动部署）
```

---

## 9. Code Review 最佳实践

### 9.1 审查者指南

| 原则 | 说明 |
|------|------|
| **先理解需求** | 在 Review 前先阅读 PR 描述和关联 Issue |
| **关注重点** | 安全 > 逻辑 > 架构 > 可读性 > 风格 |
| **给出建议** | 不只说"这里有问题"，要说明"建议改成..." |
| **区分严重度** | 使用 `[blocker]`/`[major]`/`[minor]` 标签 |
| **及时审查** | PR 提交后 24 小时内完成首次审查 |

### 9.2 开发者指南

| 原则 | 说明 |
|------|------|
| **PR 要小** | 一个 PR 只做一件事，便于审查 |
| **PR 描述清晰** | 说明做了什么、为什么做、如何测试 |
| **自审一遍** | 提交 PR 前自己先看一遍 diff |
| **及时响应** | 收到 Review 意见后 24 小时内修改 |
| **不要争论** | 对 `nitpick` 类意见接受即可，专注 `blocker` 和 `major` |

---

*文档版本：v1.0*
*最后更新：2026-06-11*
*适用项目：摸鱼圈 (MoyuCircle)*
