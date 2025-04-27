# app/main.py

from fastapi import FastAPI, HTTPException
from app.schemas import SummarizeRequest, SummarizeResponse
from app.groq_service import summarize_website

app = FastAPI(
    title="Web Summarizer API",
    version="1.0"
)

@app.post("/summarize", response_model=SummarizeResponse)
def summarize(request: SummarizeRequest):
    try:
        result = summarize_website(request.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
