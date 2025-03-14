from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ 重要：启用 CORS
import os
import openai

app = Flask(__name__)

# ✅ 允许所有来源访问 API，或者指定你的 GitHub Pages
CORS(app, origins=["https://siyi-ge.github.io"])

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is running!"}), 200

@app.route("/upload_text", methods=["POST"])
def upload_text():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    text_content = file.read().decode("utf-8")

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": "你是一个文本分析助手"},
                  {"role": "user", "content": text_content}]
    )

    gpt_response = response["choices"][0]["message"]["content"]

    return jsonify({
        "keywords": ["示例关键词1", "示例关键词2"],
        "sentiment": "positive",
        "topic": "Example",
        "xenophobia_score": 3.5
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
