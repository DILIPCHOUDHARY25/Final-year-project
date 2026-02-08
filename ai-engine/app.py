from __future__ import annotations

import os
from typing import Any, List

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from langchain_groq import ChatGroq
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from transformers import pipeline

load_dotenv()

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://localhost:5000",
            ]
        }
    },
)

SYSTEM_PROMPT = (
    "You are MindFull, a supportive mental health assistant. "
    "Keep answers brief and empathetic."
)

chat_model = ChatGroq(model="llama3-8b-8192")
sentiment_pipeline = pipeline("sentiment-analysis")


def _build_history(history: List[dict[str, Any]] | None) -> list[Any]:
    if not history:
        return []

    messages: list[Any] = []
    for item in history:
        role = item.get("role")
        content = item.get("content")
        if not content:
            continue
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role == "assistant":
            messages.append(AIMessage(content=content))
        elif role == "system":
            messages.append(SystemMessage(content=content))
    return messages


@app.route("/chat", methods=["POST"])
def chat() -> Any:
    try:
        data = request.get_json(silent=True) or {}
        message = data.get("message")
        history = data.get("history")
        if not message:
            return jsonify({"error": "Message is required."}), 400

        messages = [SystemMessage(content=SYSTEM_PROMPT)]
        messages.extend(_build_history(history))
        messages.append(HumanMessage(content=message))

        response = chat_model.invoke(messages)
        return jsonify({"response": response.content})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/analyze-sentiment", methods=["POST"])
def analyze_sentiment() -> Any:
    try:
        data = request.get_json(silent=True) or {}
        text = data.get("text")
        if not text:
            return jsonify({"error": "Text is required."}), 400

        result = sentiment_pipeline(text)[0]
        return jsonify({"label": result.get("label"), "score": result.get("score")})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port)
