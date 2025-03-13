document.getElementById("uploadButton").addEventListener("click", function() {
    let fileInput = document.getElementById("fileInput");
    
    if (!fileInput.files.length) {
        alert("请选择文件后再上传！");
        return;
    }

    let formData = new FormData();  
    formData.append("file", fileInput.files[0]);

    fetch("http://127.0.0.1:5000/upload_text", {
        method: "POST",
        body: formData,
        cache: "no-cache"
    })
    
    .then(response => response.json())
    .then(apiData => {
        console.log("✅ 完整的 API 返回数据: ", apiData);
        document.getElementById("keywords").innerText = apiData.keywords.join(", ");
        document.getElementById("sentiment").innerText = apiData.sentiment;
        document.getElementById("topic").innerText = apiData.topic;
        document.getElementById("xenophobia_score").innerText = apiData.xenophobia_score;
    })
    .catch(error => console.error("❌ API 请求失败: ", error));
});
