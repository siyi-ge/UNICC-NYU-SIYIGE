from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求，前端可访问

# 读取 OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is running!"}), 200

@app.route("/upload_text", methods=["POST"])
def upload_text():
    if "file" not in request.files:
        return jsonify({"error": "没有文件上传"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "文件名为空"}), 400

    # 读取文件内容
    text_content = file.read().decode("utf-8")

    # 调用 OpenAI API 进行分析
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "你是一个文本分析助手，返回 JSON 格式的关键词列表。"},
            {"role": "user", "content": f"请分析以下文本，并返回关键词：{text_content}"}
        ]
    )

    gpt_response = response["choices"][0]["message"]["content"]

    return jsonify({"keywords": gpt_response})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # ✅ 这里默认是 5000，但 Render 会自动替换
    app.run(host="0.0.0.0", port=port, debug=True)
