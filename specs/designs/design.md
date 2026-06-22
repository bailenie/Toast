# 摸鱼圈 (MoyuQuan) UI 设计规范文档

> **设计风格**: Vibrant Palette — 复古漫画/潮玩弹窗风\
> **核心特征**: 粗边框 + 硬偏移阴影 + 圆角 + 高饱和点缀 + 可爱动画\
> **适用项目**: 摸鱼圈 · 职场小团体情绪避雷避风港

***

## 1. 配色方案 (Color Palette)

### 1.1 主色调

| Token                  | 色值        | 用途                  |
| ---------------------- | --------- | ------------------- |
| `--color-bg-page`      | `#FFFCF5` | 页面全局背景（暖奶油白）        |
| `--color-bg-card`      | `#FFFDF9` | 卡片/面板背景（微暖白）        |
| `--color-bg-chat`      | `#FFFDF6` | 聊天区域背景              |
| `--color-text-primary` | `#2D3142` | 主文字色 / 所有边框色 / 阴影色  |
| `--color-accent`       | `#FF6B35` | 主强调色（CTA 按钮、高亮、进度条） |
| `--color-accent-hover` | `#ff7b4b` | 主强调色 hover 态        |

### 1.2 辅助色 / 功能色

| Token                       | 色值                               | 用途                        |
| --------------------------- | -------------------------------- | ------------------------- |
| `--color-accent-bg`         | `#FFE5D9`                        | 次要强调背景（浅桃色标签、hover 背景）    |
| `--color-accent-bg-2`       | `#D8E2DC`                        | 第三强调背景（鼠尾草绿，装饰 blob、鱼缸卡片） |
| `--color-accent-bg-3`       | `#D4E8FF`                        | 信息卡片背景（浅蓝，会合管理）           |
| `--color-success`           | `#00A896`                        | 成功/创建（青绿，创建按钮、经验条、模拟特权）   |
| `--color-success-bg`        | `#EDF7F6`                        | 成功态浅色背景                   |
| `--color-danger`            | `rose-500/600`                   | 危险/封禁（退出、删除、错误提示）         |
| `--color-danger-bg`         | `#FFE0E0` / `rose-50`            | 危险态浅色背景                   |
| `--color-warning`           | `#F7B32B`                        | 奖杯/金币（排行榜、进化提示）           |
| `--color-gradient-progress` | `amber-200 → rose-300 → #FF6B35` | 进度条渐变填充                   |

### 1.3 中性色

| Token                 | 色值                       | 用途               |
| --------------------- | ------------------------ | ---------------- |
| `--color-gray-light`  | `#F5F5F5` / `slate-50`   | 浅灰底（导航底栏、快捷短语底栏） |
| `--color-gray-border` | `slate-200` / `gray-200` | 次要分割线            |
| `--color-gray-text`   | `gray-400/500`           | 辅助/占位文字          |
| `--color-dot-pattern` | `#EFEBE9`                | 背景点阵图案色          |

### 1.4 Boss 老板伪装模式专用色

| Token                      | 色值                    | 用途                   |
| -------------------------- | --------------------- | -------------------- |
| `--color-boss-bg`          | `#F9FBF9`             | 伪装页全局背景              |
| `--color-boss-accent`      | `#0F9D58`             | Google Sheets 风格绿色强调 |
| `--color-boss-accent-bg`   | `#E4F2E6`             | 绿色浅底标签               |
| `--color-boss-toolbar`     | `#F1F3F4`             | 工具栏底色                |
| `--color-boss-grid-header` | `#E8EAED` / `#F1F3F4` | 表格行列头                |

***

## 2. 字体排版 (Typography)

### 2.1 字体家族

| Token            | 字体栈                                                                | 用途                          |
| ---------------- | ------------------------------------------------------------------ | --------------------------- |
| `--font-display` | `"Fredoka", "Microsoft YaHei", "Inter", sans-serif`                | **所有标题、按钮文字、品牌名、标签**（圆润可爱风） |
| `--font-sans`    | `"Inter", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif` | **正文、表单、通用文字**              |
| `--font-mono`    | `"JetBrains Mono", ui-monospace, monospace`                        | **代码、邮箱、时间戳、数字统计、ID**       |

### 2.2 字号规范

| 语义   | Tailwind Class          | 实际大小      | 字重                                          | 使用场景            |
| ---- | ----------------------- | --------- | ------------------------------------------- | --------------- |
| 极小字  | `text-xxs`              | \~8-10px  | `font-bold` / `font-black`                  | 辅助标签、提示、徽章小字    |
| 小字   | `text-xs`               | \~12px    | `font-bold` / `font-black`                  | 正文、输入框、导航按钮     |
| 正文   | `text-sm`               | \~14px    | `font-bold`                                 | 卡片正文、气泡消息       |
| 大标题  | `text-lg` / `text-xl`   | \~18-20px | `font-black`                                | 面板标题            |
| 主标题  | `text-2xl`              | \~24px    | `font-black` / `font-bold`                  | 页面主标题           |
| 品牌大字 | `text-4xl`              | \~36px    | `font-black`                                | Logo/品牌名称       |
| 超大字  | `text-6xl`              | \~60px    | —                                           | Emoji 装饰 / 加载动画 |
| 计数器  | `text-5xl` / `text-6xl` | \~48-60px | `font-black` + `font-mono` + `tabular-nums` | 窝囊费实时数字         |

### 2.3 文字样式速查

- **标题层级**: `font-display` + `font-black` / `font-bold`
- **正文/描述**: `font-sans` + `font-bold` + `text-xs` / `text-sm`
- **代码/数字**: `font-mono` + `font-bold` + `tabular-nums`
- **全大写装饰**: `uppercase` + `tracking-widest`（仅"COMPENSATION"水印等装饰元素）
- **最大宽度**: 正文段落通常限制 `max-w-sm` 或 `max-w-[280px]`

***

## 3. 边框与阴影系统 (Border & Shadow) — **核心视觉特征**

> 这是本设计最核心的视觉语言：所有卡片和容器使用**粗实色边框 + 硬偏移纯色阴影**，不透明度、不模糊扩散，营造"潮玩贴纸/复古漫画"手感。

### 3.1 预设阴影类

| Class               | 阴影参数                                        | 边框                  | 适用场景                 |
| ------------------- | ------------------------------------------- | ------------------- | -------------------- |
| `cute-shadow-sm`    | `4px 4px 0px 0px #2D3142`                   | `2px solid #2D3142` | 小卡片、消息气泡、标签          |
| `cute-shadow`       | `6px 6px 0px 0px #2D3142`                   | `3px solid #2D3142` | 面板卡片、中等容器            |
| `cute-shadow-lg`    | `8px 8px 0px 0px #2D3142`                   | `4px solid #2D3142` | **大容器、主面板、弹窗 Modal** |
| `cute-shadow-inset` | `inset 4px 4px 0px 0px rgba(45,49,66,0.15)` | `3px solid #2D3142` | 内嵌区、展示框（如工资数字框）      |

### 3.2 边框宽度速查

| 语义         | 宽度  | 使用场景                    |
| ---------- | --- | ----------------------- |
| `border-2` | 2px | 小元素、标签、徽章、次要容器          |
| `border-3` | 3px | **最常用**：输入框、中卡片、按钮、进度条  |
| `border-4` | 4px | **主容器**：大面板、页面级卡片、Modal |

**核心规则**: 所有边框颜色统一使用 `#2D3142`，除非遇到以下例外：

- `border-dashed` 虚线边框用于分割区域（如编辑表单上方）
- `border-transparent` 用于非激活导航按钮（hover 前无边框）
- 危险/成功态按钮有对应功能色边框（rose-400、emerald-400）

***

## 4. 圆角规范 (Border Radius)

| 语义   | Tailwind Class | 圆角大小   | 使用场景                |
| ---- | -------------- | ------ | ------------------- |
| 小圆角  | `rounded-lg`   | 8px    | 头像框、极小标签            |
| 中圆角  | `rounded-xl`   | 12px   | **按钮、输入框、标签、徽章**    |
| 大圆角  | `rounded-2xl`  | 16px   | **卡片内部元素、表单、头像区域**  |
| 超大圆角 | `rounded-3xl`  | 24px   | **主容器、面板、Modal 弹窗** |
| 全圆角  | `rounded-full` | 9999px | 胶囊标签、进度条轨道、状态徽章     |

> **规则**: 外层容器用 `rounded-3xl`，内部子元素用 `rounded-2xl` / `rounded-xl`，形成层级递减。

***

## 5. 间距规范 (Spacing)

### 5.1 页面布局

| 属性            | 值                            |
| ------------- | ---------------------------- |
| 页面最大宽度        | `max-w-6xl` (72rem / 1152px) |
| 页面水平 padding  | `px-4`                       |
| 页面顶部 padding  | `pt-6`                       |
| 页面底部 padding  | `pb-12`                      |
| 模块间垂直间距       | `mt-6` / `space-y-6`         |
| 尾部 footer 上间距 | `mt-10`                      |

### 5.2 卡片/面板内间距

| 场景        | padding     |
| --------- | ----------- |
| 大面板       | `p-6`       |
| 中面板       | `p-5`       |
| 小面板 / 表单区 | `p-4`       |
| 紧凑区（头部条）  | `px-4 py-2` |

### 5.3 元素间距

| 场景        | gap/spacing               |
| --------- | ------------------------- |
| 按钮组 / 图标行 | `gap-1.5` / `gap-2`       |
| 表单字段      | `gap-3`                   |
| 网格卡片      | `gap-4` / `gap-6`         |
| 列表项       | `space-y-2` / `space-y-3` |

***

## 6. 背景纹理 (Background Patterns)

### 6.1 主页面点阵背景

```css
background-image: radial-gradient(#EFEBE9 1.5px, transparent 1.5px);
background-size: 32px 32px;
```

### 6.2 聊天区域细点阵背景

```css
background-image: radial-gradient(#EFEBE9 1px, transparent 1px);
background-size: 16px 16px;
```

### 6.3 装饰 Blob（彩色模糊光斑）

所有主要页面左上/右下放置固定模糊光斑：

```html
<!-- 右上橙色光斑 -->
<div class="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#FFE5D9] 
     rounded-full opacity-50 blur-3xl pointer-events-none z-0"></div>

<!-- 左下绿色光斑 -->
<div class="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[#D8E2DC] 
     rounded-full opacity-50 blur-3xl pointer-events-none z-0"></div>
```

***

## 7. 组件设计规范

### 7.1 按钮 (Button)

#### 主按钮（Primary CTA）

```css
/* 样式 */
background: #FF6B35
hover: #ff7b4b
color: white
border: 3px solid #2D3142
border-radius: rounded-2xl (16px) / rounded-xl (12px)
font: font-display font-black text-sm / text-xs
padding: px-4 py-2 / px-4 py-2.5
shadow: shadow-sm
transition: all
active: translate-y-0.5

/* 禁用态 */
disabled:opacity-40 / disabled:opacity-50
disabled:bg-slate-100 + disabled:text-gray-400 (抽卡按钮禁用)
```

#### 次要按钮（Secondary）

```css
background: white / #FFE5D9 / #D4E8FF
border: 2px / 3px solid #2D3142
border-radius: rounded-xl
font: font-display font-bold / font-black text-xs
hover: 对应背景色加深
```

#### 危险按钮

```css
background: #FFE0E0 / rose-100
hover: rose-200
text: rose-500 / rose-600
border: 2px solid #2D3142
```

#### 成功按钮

```css
background: #00A896 / #D4EDDA
hover: emerald-300 / #00c2ad
text: white
```

#### 导航标签按钮

```css
/* 激活态 */
background: #FF6B35
border: 2px solid #2D3142
color: white
shadow: shadow-sm

/* 非激活态 */
background: transparent
border: 2px solid transparent
color: text-gray-500
hover: text-[#2D3142]
```

### 7.2 输入框 (Input)

```css
/* 默认态 */
background: #FFFCF5
border: 2px / 3px solid #2D3142
border-radius: rounded-xl / rounded-2xl
padding: px-3 py-2 / px-3 py-2.5
font: font-bold / font-black text-xs / text-sm
color: #2D3142
placeholder: text-gray-400

/* 聚焦态 */
background: white
outline: none
/* 少数场景加 ring */
focus:ring-1 focus:ring-[#FF6B35]
```

### 7.3 卡片 / 面板 (Card / Panel)

```css
/* 主面板 */
background: #FFFDF9
border: 4px solid #2D3142
border-radius: rounded-3xl
padding: p-6
shadow: cute-shadow-lg

/* 内容卡片 */
background: #FFFCF5 / white / 功能色背景
border: 3px solid #2D3142
border-radius: rounded-2xl
padding: p-4 / p-5
shadow: cute-shadow (6px) 或 cute-shadow-sm (4px)
```

### 7.4 标签 / 徽章 (Tag / Badge)

```css
/* 通用胶囊标签 */
background: #FFE5D9
border: 1px / 2px solid #2D3142 (或 border-[#FF6B35]/20)
border-radius: rounded-full
padding: px-1.5 py-0.5 / px-2 py-0.5
font: font-black text-[8px] / text-[9px] / text-[10px]

/* 脉冲动画标签 */
animate-pulse

/* 旋转装饰标签 */
transform: rotate-6 / rotate-12
```

### 7.5 进度条 (Progress Bar)

```css
/* 轨道 */
background: zinc-100 / zinc-200
height: h-5 (小) / h-10 (大)
border: 2px / 3px solid #2D3142
border-radius: rounded-xl / rounded-2xl
overflow: hidden

/* 填充 */
background: linear-gradient(to right, amber-200, rose-300, #FF6B35) 
  或 #00A896 (经验条)
border-right: 2px / 3px solid #2D3142
transition: width 300ms / 500ms ease
```

### 7.6 Modal 弹窗

```css
/* 遮罩层 */
background: rgba(0,0,0,0.6) / rgba(0,0,0,0.65)
position: fixed inset-0
z-index: 50
backdrop-filter: blur(2px) (backdrop-blur-xs)

/* 弹窗主体 */
background: #FFFDF9 / white
border: 4px solid #2D3142
border-radius: rounded-3xl
max-width: max-w-sm / max-w-md
padding: p-6
shadow: cute-shadow-lg
animation: animate-cute-float (可选)
```

### 7.7 消息气泡 (Chat Bubble)

```css
/* 自己的消息 */
background: #FFE5D9
border: 3px solid #2D3142
shadow: cute-shadow-sm
border-radius: rounded-2xl rounded-tr-none (右上直角)
text: text-sm font-bold

/* 他人的消息 */
background: white
border: 3px solid #2D3142
shadow: cute-shadow-sm
border-radius: rounded-2xl rounded-tl-none (左上直角)
text: text-sm font-bold
```

### 7.8 表格 (Table)

```css
/* 容器 */
border: 3px solid #2D3142
border-radius: rounded-2xl
overflow: hidden
box-shadow: shadow-inner

/* 表头 */
background: amber-50/40
border-bottom: 3px solid #2D3142
font: font-display text-gray-750 font-bold

/* 行 */
border-bottom: 2px solid gray-150
hover: bg-[#FFFCF5]

/* 单元格 */
padding: p-3
font: font-bold text-xs
```

### 7.9 UNO 卡牌 (Card Component)

```css
/* 卡牌容器 */
border: 3px solid #2D3142
border-radius: rounded-2xl
padding: p-2.5 / p-4
transition: card-scale (hover: scale(1.04) + translateY(-4px))

/* 稀有度标 */
font: text-[9px] font-black font-mono
border: 2px solid #2D3142
padding: px-1
background: white
- SR: text-indigo-600 bg-indigo-50
- R:  text-amber-600
- N:  text-gray-500

/* 卡牌数字大值 */
font: font-display font-black text-3xl / text-5xl
text-align: center
```

***

## 8. 动画规范 (Animation)

### 8.1 预定义关键帧

#### float（浮动呼吸）

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
/* 使用: animate-cute-float */
/* 时长: 3s ease-in-out infinite */
```

#### fish-swim（鱼游动）

```css
@keyframes fish-swim {
  0%, 100% { transform: scaleX(1) translateX(0); }
  50%      { transform: scaleX(-1) translateX(-20px); }
}
/* 使用: animate-fish-swim */
/* 时长: 6s ease-in-out infinite */
```

#### card-scale（卡牌悬浮）

```css
.card-scale {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.card-scale:hover {
  transform: scale(1.04) translateY(-4px);
}
```

### 8.2 Tailwind 内置动画使用

| Class                    | 场景                                          |
| ------------------------ | ------------------------------------------- |
| `animate-bounce`         | 加载页 Emoji、进度条水獭光标、排行榜奖杯                     |
| `animate-pulse`          | 系统标签（EVALUATOR HELPER）、蛐蛐间 30MIN 标签、模拟管理员按钮 |
| `animate-spin`           | 加载刷新图标、沙漏时钟（工作中时）                           |
| `transition-all`         | 几乎所有可交互元素                                   |
| `active:translate-y-0.5` | 按钮按下反馈（必需）                                  |
| `active:scale-95`        | 点击缩放反馈                                      |

### 8.3 过渡时间

- 通用元素: `duration-300`
- 进度条: `duration-300` / `duration-500`
- 卡牌 hover: `0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)`
- 导航标签切换: 默认 `transition-all`

***

## 9. 图标 (Icons)

### 9.1 图标库

**全部使用** **`lucide-react`**，不引入其他图标库。

### 9.2 常用图标尺寸

| 场景      | 尺寸                        |
| ------- | ------------------------- |
| 导航按钮内图标 | `w-4 h-4`                 |
| 面板标题图标  | `w-5 h-5` 或 `w-7 h-7`     |
| 小标签内图标  | `w-3 h-3` 或 `w-3.5 h-3.5` |
| 内联文本图标  | `w-3 h-3` (如 `Clock`)     |

### 9.3 图标颜色

- 导航激活态图标: 继承按钮文字色 `text-white`
- 非激活态图标: `text-gray-400` / `text-gray-500`
- 面板标题图标: `text-[#FF6B35]`（主色）、`text-[#00A896]`（青色）、`text-[#F7B32B]`（金色）

***

## 10. Emoji 使用规范

### 10.1 品牌 Emoji

| Emoji | 含义                            |
| ----- | ----------------------------- |
| 🦦    | 品牌吉祥物（摸鱼水獭），用于 Logo、加载页、进度条光标 |
| 🐟    | 默认 favicon（摸鱼模式）              |
| 📄    | Boss 伪装模式 favicon             |

### 10.2 装饰/语义 Emoji

| Emoji                    | 使用场景          |
| ------------------------ | ------------- |
| 🐠                       | 鱼缸、安全水箱       |
| 🫧                       | 鱼缸气泡装饰        |
| 🎏                       | 高级锦鲤鱼（Lv.15+） |
| 🐙                       | 中级章鱼（Lv.5+）   |
| 🥇🥈🥉                   | 排行榜前三名        |
| 🎉                       | 卡牌抽奖弹窗、成功提示   |
| 🤫                       | 聊天室空状态        |
| 🧋🍱🃏                   | 窝囊费实物等价卡片     |
| 🦦🐶🐱🐹🐼🐙🐨🐸🦊🐳🦖🐷 | 用户可选头像        |

***

## 11. 响应式断点 (Responsive Breakpoints)

沿用 Tailwind CSS 默认断点：

| 断点   | 最小宽度   | 布局变化               |
| ---- | ------ | ------------------ |
| `sm` | 640px  | 网格从1列变为多列、flex变为横排 |
| `md` | 768px  | 导航展开、侧边栏显示、隐藏移动端文字 |
| `lg` | 1024px | 三栏布局（游戏页）、大面板并排    |

### 关键响应式模式

- **Header**: `flex-col` → `md:flex-row`（移动端垂直堆叠）
- **按钮文字**: `hidden md:inline`（移动端只显示图标）
- **网格**: `grid-cols-1` → `sm:grid-cols-3` → `lg:grid-cols-3`
- **面板**: 移动端全宽，桌面端 `max-w-6xl mx-auto`

***

## 12. 双模式切换：摸鱼模式 ↔ Boss 伪装模式

### 12.1 摸鱼模式（默认）

上述所有规范适用。

### 12.2 Boss 伪装模式（Google Sheets 仿真）

| 属性      | 摸鱼模式              | Boss 模式                    |
| ------- | ----------------- | -------------------------- |
| 背景色     | `#FFFCF5`         | `#F9FBF9`                  |
| 主强调色    | `#FF6B35`         | `#0F9D58`（Google Sheets 绿） |
| 字体风格    | Fredoka 圆润        | Inter 专业无衬线                |
| 边框      | 粗黑边框 + 阴影         | 细灰边框 `border-gray-300`     |
| 圆角      | 大圆角               | 小/无圆角                      |
| 阴影      | cute-shadow 偏移硬阴影 | 无特殊阴影                      |
| 页面标题    | 摸鱼圈               | "工作周报 - 在线文档"              |
| favicon | 🐟                | 📄                         |
| 布局      | 弹性卡片布局            | 完整 Google Sheets 仿真表       |
| 工具栏     | 无                 | 撤销/重做/打印/缩放/公式栏            |
| 多表切换    | 无                 | 3个底部标签切换表                  |

**触发机制**: 按 `Esc` 键切换（3次快速连按防误触），也可通过界面按钮切换。

***

## 13. 关键 CSS 变量速查

```css
:root {
  /* 背景 */
  --bg-page: #FFFCF5;
  --bg-card: #FFFDF9;
  --bg-chat: #FFFDF6;

  /* 文字/边框/阴影 */
  --ink: #2D3142;

  /* 强调 */
  --accent: #FF6B35;
  --accent-hover: #ff7b4b;
  --accent-bg: #FFE5D9;
  --accent-bg-2: #D8E2DC;
  --accent-bg-3: #D4E8FF;

  /* 功能 */
  --success: #00A896;
  --success-bg: #EDF7F6;
  --danger-bg: #FFE0E0;
  --warning: #F7B32B;

  /* 点阵 */
  --dot-color: #EFEBE9;

  /* 字体 */
  --font-display: "Fredoka", "Microsoft YaHei", "Inter", sans-serif;
  --font-sans: "Inter", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* 阴影预设 */
  --shadow-sm: 4px 4px 0px #2D3142;
  --shadow-md: 6px 6px 0px #2D3142;
  --shadow-lg: 8px 8px 0px #2D3142;
  --shadow-inset: inset 4px 4px 0px rgba(45,49,66,0.15);
}
```

***

## 14. 开发注意事项

1. **边框不要用 box-shadow 模拟** — 使用真正的 `border` 属性，确保与偏移阴影配合正确。
2. **按钮必须加** **`active:translate-y-0.5`** **/** **`active:scale-95`** — 这是触感反馈的关键细节，缺失会显得"死板"。
3. **非交互元素加** **`select-none`** — Emoji 头像、装饰文字、水印等。
4. **文字均用** **`font-bold`** **或** **`font-black`** — 本项目没有常规字重的文字（装饰除外）。
5. **所有容器内容区加** **`relative overflow-hidden`** — 防止背景装饰元素溢出。
6. **进度条必须用** **`transition-all`** **或** **`duration-300/500`** — 保证平滑过渡。
7. **`font-mono`** **+** **`tabular-nums`** 用于任何需要等宽数字的场景（计数器、倒计时）。
8. **图标全部来自 lucide-react**，不要引入其他图标库。
9. **Google Fonts 引入**:
   ```
   https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700
   &family=Inter:wght@300;400;500;600;700
   &family=JetBrains+Mono:wght@400;500;700
   ```
10. **Boss 模式 UI 完全独立于主模式** — 不共享 cute-shadow 体系，走专业仿真风格。

