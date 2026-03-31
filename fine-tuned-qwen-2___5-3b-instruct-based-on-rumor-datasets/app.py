import os
import torch
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL_PATH = os.getenv("MODEL_PATH", "/app/model")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
TORCH_DTYPE = torch.bfloat16 if DEVICE == "cuda" else torch.float32

model = None
tokenizer = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer
    print(f"Loading model from {MODEL_PATH} on {DEVICE} ...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH,
        torch_dtype=TORCH_DTYPE,
        device_map="auto" if DEVICE == "cuda" else None,
    )
    if DEVICE == "cpu":
        model = model.to(DEVICE)
    model.eval()
    print("Model loaded successfully.")
    yield
    del model, tokenizer
    if DEVICE == "cuda":
        torch.cuda.empty_cache()


app = FastAPI(title="Rumor Detection API", lifespan=lifespan)


# ── Request / Response schemas ───────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(system|user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    max_new_tokens: int = Field(default=512, ge=1, le=2048)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_p: float = Field(default=0.8, ge=0.0, le=1.0)
    top_k: int = Field(default=20, ge=1, le=100)
    repetition_penalty: float = Field(default=1.05, ge=1.0, le=2.0)


class ChatResponse(BaseModel):
    response: str
    usage: dict


class RumorRequest(BaseModel):
    text: str
    max_new_tokens: int = Field(default=256, ge=1, le=1024)


class RumorResponse(BaseModel):
    text: str
    result: str
    usage: dict


# ── Inference helper ─────────────────────────────────────────────────────────

def generate(messages: list[dict], **kwargs) -> tuple[str, dict]:
    text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    inputs = tokenizer(text, return_tensors="pt").to(model.device)
    input_len = inputs["input_ids"].shape[-1]

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=kwargs.get("max_new_tokens", 512),
            temperature=kwargs.get("temperature", 0.7),
            top_p=kwargs.get("top_p", 0.8),
            top_k=kwargs.get("top_k", 20),
            repetition_penalty=kwargs.get("repetition_penalty", 1.05),
            do_sample=kwargs.get("temperature", 0.7) > 0,
        )

    output_len = outputs.shape[-1]
    response = tokenizer.decode(outputs[0][input_len:], skip_special_tokens=True)
    usage = {
        "prompt_tokens": input_len,
        "completion_tokens": output_len - input_len,
        "total_tokens": output_len,
    }
    return response, usage


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "device": DEVICE, "model": MODEL_PATH}


@app.post("/v1/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        messages = [m.model_dump() for m in req.messages]
        response, usage = generate(
            messages,
            max_new_tokens=req.max_new_tokens,
            temperature=req.temperature,
            top_p=req.top_p,
            top_k=req.top_k,
            repetition_penalty=req.repetition_penalty,
        )
        return ChatResponse(response=response, usage=usage)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/v1/rumor-detect", response_model=RumorResponse)
async def rumor_detect(req: RumorRequest):
    """Pass raw text, get rumor detection result."""
    try:
        messages = [
            {
                "role": "system",
                "content": "你是一个谣言检测助手。请分析用户提供的文本，判断其是否为谣言，并给出理由。",
            },
            {"role": "user", "content": f"请判断以下内容是否为谣言：\n\n{req.text}"},
        ]
        response, usage = generate(messages, max_new_tokens=req.max_new_tokens)
        return RumorResponse(text=req.text, result=response, usage=usage)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
