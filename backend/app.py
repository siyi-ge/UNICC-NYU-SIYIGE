from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 读取 OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is running!"}), 200

@app.route("/upload_text", methods=["POST"])
def upload_text():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    text_content = file.read().decode("utf-8")

    try:
        # 调用 OpenAI API 处理文本
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "你是一个文本分析助手"},
                {"role": "user", "content": text_content}
            ]
        )

        gpt_response = response["choices"][0]["message"]["content"]
        return jsonify({"keywords": gpt_response, "message": "Success"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # 使用 Render 自动分配的端口
    app.run(host="0.0.0.0", port=port, debug=True)
