# 前端与后端 API 交互接口整理

## URL 基础配置

前端通过两个函数构造后端地址（`frontend/src/core/config/index.ts`）：

| 函数 | 作用 | 默认值 |
|------|------|--------|
| `getBackendBaseURL()` | DeerFlow Gateway API 基地址 | 空串（同源，经 nginx 代理到 `127.0.0.1:8001`） |
| `getLangGraphBaseURL()` | LangGraph API 基地址 | `/api/langgraph`（经 nginx 代理到 `127.0.0.1:2024`） |

---

## 一、Gateway REST API（通过 fetch 直接调用）

### 1. 对话线程相关

| 方法 | 端点 | 用途 | 调用文件 |
|------|------|------|---------|
| POST | `/api/threads/{threadId}/suggestions` | 根据近期消息生成后续建议问题 | `components/workspace/input-box.tsx` |
| DELETE | `/api/threads/{threadId}` | 删除线程的本地数据（配合 LangGraph 删除） | `core/threads/hooks.ts` |

### 2. 文件上传

| 方法 | 端点 | 用途 | 调用文件 |
|------|------|------|---------|
| POST | `/api/threads/{threadId}/uploads` | 上传附件（multipart） | `core/uploads/api.ts` |
| GET | `/api/threads/{threadId}/uploads/list` | 列出已上传文件 | `core/uploads/api.ts` |
| DELETE | `/api/threads/{threadId}/uploads/{filename}` | 删除指定附件 | `core/uploads/api.ts` |

### 3. 用户记忆（Memory）

| 方法 | 端点 | 用途 | 调用文件 |
|------|------|------|---------|
| GET | `/api/memory` | 加载用户记忆 | `core/memory/api.ts` |
| DELETE | `/api/memory` | 清空全部记忆 | `core/memory/api.ts` |
| GET | `/api/memory/export` | 导出记忆快照 | `core/memory/api.ts` |
| POST | `/api/memory/import` | 导入记忆 JSON | `core/memory/api.ts` |
| POST | `/api/memory/facts` | 创建记忆事实 | `core/memory/api.ts` |
| PATCH | `/api/memory/facts/{factId}` | 更新记忆事实 | `core/memory/api.ts` |
| DELETE | `/api/memory/facts/{factId}` | 删除记忆事实 | `core/memory/api.ts` |

### 4. 智能体（Agents）

| 方法 | 端点 | 用途 | 调用文件 |
|------|------|------|---------|
| GET | `/api/agents` | 获取智能体列表 | `core/agents/api.ts` |
| GET | `/api/agents/{name}` | 获取指定智能体 | `core/agents/api.ts` |
| POST | `/api/agents` | 创建智能体 | `core/agents/api.ts` |
| PUT | `/api/agents/{name}` | 更新智能体 | `core/agents/api.ts` |
| DELETE | `/api/agents/{name}` | 删除智能体 | `core/agents/api.ts` |
| GET | `/api/agents/check?name=...` | 检查智能体名称是否可用 | `core/agents/api.ts` |

### 5. 技能（Skills）

| 方法 | 端点 | 用途 | 调用文件 |
|------|------|------|---------|
| GET | `/api/skills` | 获取技能列表 | `core/skills/api.ts` |
| PUT | `/api/skills/{skillName}` | 启用/禁用技能 | `core/skills/api.ts` |
| POST | `/api/skills/install` | 为线程安装技能 | `core/skills/api.ts` |

### 6. 模型（Models）

| 方法 | 端点 | 用途 | 调用文件 |
|------|------|------|---------|
| GET | `/api/models` | 获取可用模型列表 | `core/models/api.ts` |

### 7. MCP 工具配置

| 方法 | 端点 | 用途 | 调用文件 |
|------|------|------|---------|
| GET | `/api/mcp/config` | 获取 MCP 服务器配置 | `core/mcp/api.ts` |
| PUT | `/api/mcp/config` | 更新 MCP 配置 | `core/mcp/api.ts` |

### 8. 制品/产出物（Artifacts）

| 方法 | 端点 | 用途 | 调用文件 |
|------|------|------|---------|
| GET | `/api/threads/{threadId}/artifacts/{filepath}` | 下载制品文件内容 | `core/artifacts/loader.ts` |

---

## 二、LangGraph SDK 调用（通过 @langchain/langgraph-sdk）

客户端构造在 `core/api/api-client.ts`，基地址为 `getLangGraphBaseURL()`。

### 显式方法调用

| SDK 方法 | 对应 HTTP | 用途 | 调用文件 |
|----------|----------|------|---------|
| `apiClient.threads.search(params)` | POST `/threads/search` | 搜索/分页加载线程列表 | `core/threads/hooks.ts` |
| `apiClient.threads.delete(threadId)` | DELETE `/threads/{id}` | 删除线程 | `core/threads/hooks.ts` |
| `apiClient.threads.updateState(id, values)` | POST `/threads/{id}/state` | 更新线程状态（如重命名标题） | `core/threads/hooks.ts` |
| `apiClient.threads.getState(id)` | GET `/threads/{id}/state` | 获取线程完整状态（导出用） | `components/workspace/recent-chat-list.tsx` |

### 流式交互（useStream / submit）

| 机制 | 用途 | 调用文件 |
|------|------|---------|
| `useStream({ client, assistantId: "lead_agent", threadId, ... })` | 订阅线程 SSE 流、自动重连、加载历史 | `core/threads/hooks.ts` |
| `thread.submit(message, streamOptions)` | 发送消息并启动/继续一轮流式对话 | `core/threads/hooks.ts` |

---

## 三、Next.js 服务端代理路由（src/app/api/）

这些是 Next.js 服务端中转路由，前端请求经此转发到后端：

| 路由 | 方法 | 转发目标 |
|------|------|---------|
| `/api/memory` | GET, DELETE | 转发到 Gateway `/api/memory` |
| `/api/memory/{...path}` | GET, POST, DELETE, PATCH | 转发到 Gateway `/api/memory/{path}` |
| `/api/auth/{...all}` | GET, POST | better-auth 处理器（登录认证，未启用） |

---

## 四、Mock 路由（src/app/mock/api/）

演示模式下使用的静态数据路由：

| 路由 | 方法 | 用途 |
|------|------|------|
| `/mock/api/threads/search` | POST | 返回演示线程列表 |
| `/mock/api/threads/{id}/history` | POST | 返回演示线程历史 |
| `/mock/api/threads/{id}/artifacts/{...path}` | GET | 返回演示制品文件 |
| `/mock/api/skills` | GET | 返回演示技能列表 |
| `/mock/api/models` | GET | 返回演示模型列表 |
| `/mock/api/mcp/config` | GET | 返回演示 MCP 配置 |

---

## 五、总计

| 分类 | 数量 |
|------|------|
| Gateway REST 接口 | 22 个（跨 8 个业务模块） |
| LangGraph SDK 接口 | 4 个显式方法 + 流式订阅/提交 |
| Next.js 代理路由 | 3 组 |
| Mock 路由 | 6 个 |
