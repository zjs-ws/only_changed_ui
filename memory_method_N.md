# 前端持久化方法整理

## 一、用户状态保存方法

### 1. 语言偏好

- **存储介质**：Cookie
- **Key**：`locale`
- **有效期**：1 年
- **写入时机**：用户切换语言时调用 `changeLocale()` → `setLocaleInCookie()`
- **读取时机**：页面加载时 `useI18n` 钩子的 `useEffect` 调用 `getLocaleFromCookie()`
- **回退策略**：若 Cookie 不存在（首次访问），通过 `detectLocale()` 自动检测浏览器语言
- **关键文件**：
  - `frontend/src/core/i18n/cookies.ts` — Cookie 读写工具函数
  - `frontend/src/core/i18n/hooks.ts` — 初始化与切换逻辑
  - `frontend/src/core/i18n/context.tsx` — React Context 提供者

### 2. 主题偏好（深色/浅色/跟随系统）

- **存储介质**：localStorage（由 next-themes 库自动管理）
- **Key**：`theme`
- **有效期**：永久（除非手动清除浏览器数据）
- **写入时机**：用户切换主题时调用 `setTheme()`，库内部自动写入 localStorage
- **读取时机**：`ThemeProvider` 组件初始化时自动从 localStorage 读取
- **默认值**：`dark`（深色）
- **特殊规则**：首页路径 `/` 强制使用深色主题
- **关键文件**：
  - `frontend/src/components/theme-provider.tsx` — 主题 Provider 配置

### 3. 用户设置（模型/模式/推理深度/置顶/侧边栏布局）

- **存储介质**：localStorage
- **Key**：`myagent.local-settings`
- **有效期**：永久
- **存储内容**：
  - `context`：模型名称、模式（flash/thinking/pro/ultra）、推理深度
  - `notification`：通知开关
  - `layout`：侧边栏是否折叠、置顶的对话 ID 列表
- **写入时机**：用户更改任何设置项时，通过 `saveLocalSettings()` 写入
- **读取时机**：组件挂载时通过 `getLocalSettings()` 读取，与默认值合并
- **关键文件**：
  - `frontend/src/core/settings/local.ts` — 读写函数与默认值定义
  - `frontend/src/core/settings/hooks.ts` — React Hook 封装

### 4. 侧边栏展开/折叠状态

- **存储介质**：Cookie + localStorage（双写）
- **Cookie Key**：`sidebar_state`，有效期 7 天
- **localStorage Key**：合并在 `myagent.local-settings` 的 `layout.sidebar_collapsed` 字段
- **关键文件**：
  - `frontend/src/components/ui/sidebar.tsx` — Cookie 写入
  - `frontend/src/app/workspace/layout.tsx` — 从 localSettings 读取初始状态

### 5. 登录认证（尚未启用）

- **预留方案**：better-auth 库，支持邮箱密码登录
- **会话存储**：启用后由 better-auth 通过 HTTP-only Cookie 管理
- **当前状态**：仅有脚手架代码，未接入任何页面或中间件
- **关键文件**：
  - `frontend/src/server/better-auth/config.ts` — better-auth 配置
  - `frontend/src/server/better-auth/client.ts` — 前端 SDK 客户端
  - `frontend/src/server/better-auth/server.ts` — 服务端会话获取
  - `frontend/src/app/api/auth/[...all]/route.ts` — API 路由

---

## 二、AI 对话历史记录储存方法

### 1. 对话线程列表

- **存储位置**：后端 LangGraph 服务（服务端持久化）
- **前端获取方式**：TanStack Query + `apiClient.threads.search()` 从后端拉取
- **缓存策略**：TanStack Query 内存缓存，页面刷新后重新拉取
- **关键文件**：
  - `frontend/src/core/threads/hooks.ts` — `useThreads` Hook
  - `frontend/src/core/api/api-client.ts` — LangGraph SDK 客户端单例

### 2. 对话消息（实时流式）

- **存储位置**：后端 LangGraph 服务
- **前端获取方式**：通过 LangGraph SDK 的 SSE（Server-Sent Events）流式传输
- **核心机制**：`useThreadStream` → `useStream`，配置 `reconnectOnMount: true`，断线自动重连
- **历史加载**：`fetchStateHistory: { limit: 1 }` 获取最近一次状态快照
- **关键文件**：
  - `frontend/src/core/threads/hooks.ts` — `useThreadStream` Hook

### 3. 用户记忆（Memory）

- **存储位置**：后端 Gateway API
- **功能**：智能体从对话中自动学习的用户信息（事实、偏好、上下文）
- **前端操作**：通过 HTTP API 进行 CRUD，配合 TanStack Query 做缓存
- **关键文件**：
  - `frontend/src/core/memory/api.ts` — Memory API 调用
  - `frontend/src/core/memory/hooks.ts` — React Hook 封装

### 4. Mock/演示模式

- **存储位置**：`frontend/public/demo/threads/*/thread.json` 静态文件
- **用途**：离线演示，非用户数据
- **关键文件**：
  - `frontend/src/app/mock/api/threads/` — Mock API 路由

---

## 三、汇总表

| 数据 | 存储介质 | Key / 位置 | 有效期 | 是否依赖后端 |
|------|---------|-----------|--------|------------|
| 语言偏好 | Cookie | `locale` | 1 年 | 否 |
| 主题偏好 | localStorage | `theme` | 永久 | 否 |
| 用户设置 | localStorage | `myagent.local-settings` | 永久 | 否 |
| 侧边栏状态 | Cookie + localStorage | `sidebar_state` + localSettings | 7 天 / 永久 | 否 |
| 登录会话 | HTTP-only Cookie（未启用） | — | — | 是 |
| 对话线程列表 | 后端 LangGraph | — | 持久 | 是 |
| 对话消息 | 后端 LangGraph | — | 持久 | 是 |
| 用户记忆 | 后端 Gateway | — | 持久 | 是 |

### 注意事项

- 所有客户端存储（Cookie / localStorage）**与用户账号无关**，仅绑定当前浏览器
- 更换浏览器或清除浏览器数据后，客户端偏好设置将恢复为默认值
- 对话历史和用户记忆存在后端，不受浏览器数据清理影响
- sessionStorage 和 IndexedDB 在本项目中**均未使用**
