from flask import Flask, request, jsonify
import openai
import os

# 设置 OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")  # 确保 API Key 从环境变量加载

app = Flask(__name__)

@app.route('/upload_text', methods=['POST'])
def upload_text():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "没有文件上传"}), 400

    text_content = file.read().decode("utf-8")

    # 🔍 发送到 OpenAI API 进行文本分析
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "你是一个文本分析助手"},
            {"role": "user", "content": text_content}
        ]
    )

    gpt_response = response["choices"][0]["message"]["content"]

    return jsonify({
        "keywords": ["示例关键词1", "示例关键词2"],
        "sentiment": "positive",
        "topic": "Example",
        "xenophobia_score": 3.5
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
