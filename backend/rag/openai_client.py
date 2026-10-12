import os

from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Get the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load the .env file from the backend directory
load_dotenv(BASE_DIR / ".env")

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY is missing from .env")

client = OpenAI(api_key=api_key)