# MindfulStudent AI Engine (Service B)

This service provides AI chat and sentiment analysis endpoints for the MindfulStudent platform. It runs on port `8000` and is designed to be called by the backend (Service A) and frontend (Service C).

## Requirements

- Python 3.10+
- A Groq API key

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Add your Groq API key to `.env`.

## Running the service

```bash
python app.py
```

The service listens on `http://localhost:8000`.

## Endpoints

### `POST /chat`

Request body:

```json
{
  "message": "I feel stressed today.",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi, how can I help?"}
  ]
}
```

Response:

```json
{
  "response": "I'm here for you. Want to share what's been stressful?"
}
```

### `POST /analyze-sentiment`

Request body:

```json
{
  "text": "I'm feeling optimistic about the week ahead."
}
```

Response:

```json
{
  "label": "POSITIVE",
  "score": 0.99
}
```
