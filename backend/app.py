from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求，确保前端能访问 API

# 读取 OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# 默认首页，检查 API 是否运行
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is running!"}), 200

# 上传文本并调用 OpenAI API 进行分析
@app.route("/upload_text", methods=["POST"])
def upload_text():
    if "file" not in request.files:
        return jsonify({"error": "没有文件上传"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "文件名为空"}), 400

    # 读取文件内容
    text_content = file.read().decode("utf-8")

    # 调用 OpenAI API 进行文本分析
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "你是一个文本分析助手，返回 JSON 格式的关键词列表。"},
            {"role": "user", "content": f"请分析以下文本，并返回关键词：{text_content}"}
        ]
    )

    gpt_response = response["choices"][0]["message"]["content"]

    # 返回 JSON 格式的数据
    return jsonify({
        "keywords": gpt_response,  # 假设 GPT 返回的是关键词列表
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
