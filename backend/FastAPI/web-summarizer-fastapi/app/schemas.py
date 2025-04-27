# app/schemas.py

from pydantic import BaseModel, HttpUrl

class SummarizeRequest(BaseModel):
    url: HttpUrl

class SummarizeResponse(BaseModel):
    url: HttpUrl
    summary: str

