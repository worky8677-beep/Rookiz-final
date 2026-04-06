from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests, os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Msg(BaseModel):
    text: str


HF_URL = "https://router.huggingface.co/v1/chat/completions"
HF_MODEL = "Qwen/Qwen2.5-72B-Instruct"


def ask_ai(q: str) -> str:
    token = os.getenv("HF_TOKEN")
    if not token:
        print("에러: HF_TOKEN이 설정되지 않았습니다.")
        return "죄송해요, AI 루가 지금은 잠시 쉬는 중이에요. (API 키 오류)"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    # Hugging Face Chat API용 표준 페이로드
    payload = {
        "model": HF_MODEL,
        "messages": [
            {"role": "system", "content": "너는 어린이들의 친절한 친구 AI 캐릭터 '루'야. 항상 친절하고 따뜻하게 대답해줘."},
            {"role": "user", "content": q}
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }
    
    try:
        res = requests.post(HF_URL, headers=headers, json=payload, timeout=20)
        res.raise_for_status()
        data = res.json()
        
        # 응답 데이터에서 텍스트 추출 (OpenAI 규격)
        if "choices" in data and len(data["choices"]) > 0:
            return data["choices"][0]["message"]["content"]
        else:
            print(f"이상 응답: {data}")
            return "루가 조금 피곤한가 봐요. 잠시 후에 다시 말 걸어줄래요?"
            
    except Exception as e:
        print(f"AI 호출 오류 상세: {e}")
        return "앗, 서버랑 연결이 잠깐 끊겼어요! 다시 한번 말해봐줄래?"


@app.post("/chat")
async def chat(msg: Msg):
    try:
        reply = ask_ai(msg.text)
        return {"reply": reply}
    except Exception as e:
        print(f"엔드포인트 오류: {e}")
        return {"reply": "서버 오류가 발생했어요. 나중에 다시 시도해주세요!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
