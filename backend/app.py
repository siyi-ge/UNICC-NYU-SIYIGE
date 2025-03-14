from flask import Flask, request, jsonify
import os
import openai

app = Flask(__name__)

# 读取 OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# 默认主页，检查 API 是否运行
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is running!"}), 200

# 上传文件并分析文本
@app.route("/upload_text", methods=["POST"])
def upload_text():
    if "file" not in request.files:
        return jsonify({"error": "没有文件上传"}), 400

    file = request.files["file"]
    text_content = file.read().decode("utf-8")

    # 发送到 OpenAI API 进行分析
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "你是一个文本分析助手"},
            {"role": "user", "content": text_content}
        ]
    )

    # 解析 AI 响应
    gpt_response = response["choices"][0]["message"]["content"]

    # 假设 AI 生成的结果如下（这里可以替换成你的模型返回格式）
    result = {
        "keywords": ["示例", "文本", "分析", "AI"],
        "sentiment": "positive",
        "topic": "示例主题",
        "xenophobia_score": 2.5
    }

    return jsonify(result)

# 启动 Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
