# app/groq_service.py

import os
import logging
from dotenv import load_dotenv
from openai import OpenAI
import requests
from bs4 import BeautifulSoup

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"  # Groq OpenAI-compatible endpoint
)

def summarize_website(url: str) -> dict:
    logger.info(f"Fetching website: {url}")

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except Exception as e:
        logger.error(f"Error fetching URL: {e}")
        raise Exception(f"Failed to fetch URL: {e}")

    soup = BeautifulSoup(response.text, "html.parser")
    text = soup.get_text(separator=" ", strip=True)

    if not text or len(text.strip()) < 100:
        raise Exception("The page has insufficient text to summarize.")

    truncated_text = text[:3000]

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192", #llama3 model used
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes web pages concisely in a single paragraph."},
                {"role": "user", "content": f"Summarize this website content:\n{truncated_text}"}
            ]
        )
        summary = completion.choices[0].message.content.strip()
        logger.info("Summary generated successfully.")
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        raise Exception(f"Groq API error: {e}")

    return {
        "url": url,
        "summary": summary
    }
