document.getElementById("uploadButton").addEventListener("click", function () {
    let fileInput = document.getElementById("fileInput");
    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    // ✅ 确保前端请求的是 **远程 API 地址**
    fetch("https://unicc-nyu-siyige.onrender.com/upload_text", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(apiData => {
        console.log("✅ API 结果: ", apiData);

        document.getElementById("keywords").innerText = "关键词: " + apiData.keywords.join(", ");
        document.getElementById("sentiment").innerText = "情感分析: " + apiData.sentiment;
        document.getElementById("topic").innerText = "主题: " + apiData.topic;
        document.getElementById("xenophobia_score").innerText = "仇外情绪评分: " + apiData.xenophobia_score;
    })
    .catch(error => console.error("❌ API 请求失败: ", error));
});
