from flask import Flask, request, jsonify
import openai
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 确保 API key 来自环境变量
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/upload_text', methods=['POST'])
def upload_text():
    if 'file' not in request.files:
        return jsonify({"error": "没有文件上传"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "文件名为空"}), 400

    text_content = file.read().decode("utf-8")

    # 调用 OpenAI API 进行文本分析
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个文本分析助手，请提取关键词"},
                {"role": "user", "content": text_content}
            ]
        )

        gpt_response = response["choices"][0]["message"]["content"]

        # 假设返回的内容是关键词列表，我们模拟解析
        keywords = gpt_response.split()

        return jsonify({"keywords": keywords})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
