# 谣言检测模型 — Docker 一键部署与调用指南

## 一键部署

### 前提条件

- 已安装 [Docker](https://docs.docker.com/get-docker/)
- GPU 部署额外需要 [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)

### 构建镜像

```bash
cd /path/to/fine-tuned-qwen-2.5-3b-instruct-based-on-rumor-datasets
docker build -t rumor-detector .
```

### 启动服务

CPU 部署：

```bash
docker run -d --name rumor-detector -p 8000:8000 rumor-detector
```

GPU 部署：

```bash
docker run -d --name rumor-detector --gpus all -p 8000:8000 rumor-detector
```

使用 docker-compose：

```bash
# GPU（默认）
docker compose up -d rumor-detector

# CPU
docker compose --profile cpu up -d rumor-detector-cpu
```

### 常用管理命令

```bash
# 查看日志
docker logs -f rumor-detector

# 停止服务
docker stop rumor-detector

# 删除容器
docker rm rumor-detector
```

## 调用示例

### 1. 健康检查

```bash
curl http://localhost:8000/health
```

返回示例：

```json
{
  "status": "ok",
  "device": "cpu",
  "model": "/app/model"
}
```

### 2. 谣言检测（快捷接口）

```bash
curl -X POST http://localhost:8000/v1/rumor-detect \
  -H "Content-Type: application/json" \
  -d '{"text": "紫菜是用塑料袋做的", "max_new_tokens": 256}'
```

返回示例：

```json
{
  "text": "紫菜是用塑料袋做的",
  "result": "这是一条谣言。紫菜是一种天然海藻类食物...",
  "usage": {
    "prompt_tokens": 58,
    "completion_tokens": 120,
    "total_tokens": 178
  }
}
```

### 3. 通用对话接口

```bash
curl -X POST http://localhost:8000/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "你是一个专业的谣言检测助手。"},
      {"role": "user", "content": "隔夜茶会致癌，千万不能喝"}
    ],
    "max_new_tokens": 512,
    "temperature": 0.7,
    "top_p": 0.8,
    "top_k": 20,
    "repetition_penalty": 1.05
  }'
```

返回示例：

```json
{
  "response": "这是一条常见的谣言。隔夜茶中的亚硝酸盐含量远低于...",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 200,
    "total_tokens": 245
  }
}
```

### 4. Python 调用

```python
import requests

# 谣言检测
resp = requests.post("http://localhost:8000/v1/rumor-detect", json={
    "text": "吃大蒜可以预防新冠病毒"
})
print(resp.json()["result"])

# 通用对话
resp = requests.post("http://localhost:8000/v1/chat", json={
    "messages": [
        {"role": "system", "content": "你是谣言检测助手。"},
        {"role": "user", "content": "5G基站会传播病毒，是真的吗？"}
    ],
    "max_new_tokens": 256
})
print(resp.json()["response"])
```

### 5. 交互式 API 文档

启动服务后，在浏览器中打开以下地址即可在线测试所有接口：

| 地址 | 说明 |
|---|---|
| http://localhost:8000/docs | Swagger UI（可交互测试） |
| http://localhost:8000/redoc | ReDoc（只读文档） |

## 接口参数说明

| 参数 | 默认值 | 范围 | 说明 |
|---|---|---|---|
| max_new_tokens | 512 / 256 | 1 - 2048 | 最大生成 token 数 |
| temperature | 0.7 | 0.0 - 2.0 | 越高越随机，0 为确定性输出 |
| top_p | 0.8 | 0.0 - 1.0 | 核采样阈值 |
| top_k | 20 | 1 - 100 | 只从概率最高的 k 个 token 中采样 |
| repetition_penalty | 1.05 | 1.0 - 2.0 | 重复惩罚系数，>1 抑制重复 |
