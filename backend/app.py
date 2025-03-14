import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS

# 创建 Flask 应用
app = Flask(__name__)
CORS(app)  # ✅ 允许跨域请求（CORS）

# 读取 OpenAI API Key
openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # ✅ 新 API 方式

@app.route("/", methods=["GET"])
def home():
    """ 检查 API 是否正常运行 """
    return jsonify({"message": "API is running!"}), 200

@app.route("/upload_text", methods=["POST"])
def upload_text():
    """ 处理文件上传并调用 OpenAI API 进行文本分析 """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    text_content = file.read().decode("utf-8")

    # ✅ 调用 OpenAI API 进行文本分析
    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": text_content}]
    )

    # 提取 OpenAI 返回的数据
    gpt_response = response.choices[0].message.content

    return jsonify({
        "message": "文件上传成功",
        "response": gpt_response
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # ✅ Render 平台会自动替换 PORT
    app.run(host="0.0.0.0", port=port, debug=True)
