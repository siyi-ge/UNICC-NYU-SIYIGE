from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json

app = Flask(__name__)
CORS(app)  # 允许前端访问

@app.route("/", methods=["GET"])
def home():
    return "多模态分析服务器运行成功！"

@app.route("/upload_text", methods=["POST"])
def upload_text():
    """处理文本分析"""
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "没有文件上传"}), 400
        
    text_content = file.read().decode("utf-8")
    
    # 使用OpenAI API进行文本分析
    try:
        # 确保设置了环境变量
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            return jsonify({"error": "未设置OpenAI API密钥"}), 500
            
        # 调用OpenAI API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_api_key}"
        }
        
        payload = {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": "你是一个文本分析助手，请分析以下文本并返回关键词、情感、主题和仇外评分（0-10）"},
                {"role": "user", "content": text_content}
            ],
            "temperature": 0.3
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            return jsonify({"error": f"API请求失败: {response.text}"}), 500
            
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        
        # 解析返回的内容
        # 这里需要根据实际返回的格式进行调整
        analysis_result = {
            "keywords": extract_keywords(content),
            "sentiment": extract_sentiment(content),
            "topic": extract_topic(content),
            "xenophobia_score": extract_xenophobia_score(content)
        }
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({"error": f"处理失败: {str(e)}"}), 500

@app.route("/upload_audio", methods=["POST"])
def upload_audio():
    """处理音频分析"""
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "没有文件上传"}), 400
    
    # 保存上传的音频文件
    filename = file.filename
    file_path = os.path.join('/tmp', filename)
    file.save(file_path)
    
    try:
        # 这里应该调用队友提供的音频分析API
        # 示例结果（等待队友API完成后替换）
        analysis_result = {
            "emotion": "neutral",
            "language": "Chinese",
            "keywords": ["等待队友API"],
            "confidence": 0.85
        }
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({"error": f"处理失败: {str(e)}"}), 500
    finally:
        # 删除临时文件
        if os.path.exists(file_path):
            os.remove(file_path)

@app.route("/upload_video", methods=["POST"])
def upload_video():
    """处理视频分析"""
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "没有文件上传"}), 400
    
    # 保存上传的视频文件
    filename = file.filename
    file_path = os.path.join('/tmp', filename)
    file.save(file_path)
    
    try:
        # 这里应该调用队友提供的视频分析API
        # 示例结果（等待队友API完成后替换）
        analysis_result = {
            "objects": ["等待队友API"],
            "scene_type": "等待队友API",
            "emotions": ["等待队友API"],
            "key_moments": [{"time": "00:00:00", "description": "等待队友API"}]
        }
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({"error": f"处理失败: {str(e)}"}), 500
    finally:
        # 删除临时文件
        if os.path.exists(file_path):
            os.remove(file_path)

# 辅助函数，用于从OpenAI返回的内容中提取信息
def extract_keywords(content):
    # 简单实现，实际中可能需要更复杂的解析
    try:
        if "关键词" in content:
            keywords_text = content.split("关键词")[1].split("\n")[0]
            keywords = [k.strip() for k in keywords_text.replace(":", "").replace("：", "").split(",")]
            return keywords[:5]  # 限制返回5个关键词
    except:
        pass
    return ["分析中"]

def extract_sentiment(content):
    sentiments = ["positive", "negative", "neutral"]
    for sentiment in sentiments:
        if sentiment in content.lower():
            return sentiment
    return "neutral"

def extract_topic(content):
    try:
        if "主题" in content:
            topic_text = content.split("主题")[1].split("\n")[0]
            return topic_text.replace(":", "").replace("：", "").strip()
    except:
        pass
    return "General"

def extract_xenophobia_score(content):
    try:
        if "仇外评分" in content:
            score_text = content.split("仇外评分")[1].split("\n")[0]
            score = float(score_text.replace(":", "").replace("：", "").strip())
            return min(10, max(0, score))  # 确保分数在0-10之间
    except:
        pass
    return 0.0

if __name__ == "__main__":
    app.run(debug=True, port=5000)
