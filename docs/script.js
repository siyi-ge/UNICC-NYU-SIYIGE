// 监听上传按钮
document.getElementById("uploadButton").addEventListener("click", function () {
    uploadFile();
});

// 处理文件上传
function uploadFile() {
    let fileInput = document.getElementById("fileInput").files[0];
    let apiUrl = "https://unicc-nyu-siyige.onrender.com/upload_text";

    if (!fileInput) {
        alert("❌ 请选择一个文件");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput);

    // 发送 API 请求
    fetch(apiUrl, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ API 返回的数据:", data);  // 确保 API 返回正确数据

        if (data.error) {
            alert("❌ API 处理错误: " + data.error);
            return;
        }

        // 渲染不同的可视化模块
        renderWordCloud(data.keywords);
        renderSentimentChart(data.sentiment);
        renderKeywordNetwork(data.keywords);
    })
    .catch(error => {
        console.error("❌ API 请求失败:", error);
        alert("❌ 网络请求失败，请检查 API 是否运行");
    });
}

// 📌 渲染词云
function renderWordCloud(keywords) {
    let wordCloudDiv = document.getElementById("wordCloud");
    wordCloudDiv.innerHTML = "";  // 清空旧的内容

    let wordCloud = document.createElement("div");
    wordCloud.style.fontSize = "20px";
    wordCloud.style.fontWeight = "bold";

    keywords.forEach(word => {
        let span = document.createElement("span");
        span.textContent = word + " ";
        span.style.fontSize = (Math.random() * 20 + 10) + "px";
        span.style.margin = "5px";
        span.style.color = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
        wordCloud.appendChild(span);
    });

    wordCloudDiv.appendChild(wordCloud);
}

// 📌 渲染情感分布
function renderSentimentChart(sentiment) {
    let sentimentDiv = document.getElementById("sentimentChart");
    sentimentDiv.innerHTML = `<h3>情感分析: ${sentiment}</h3>`;
}

// 📌 渲染关键词网络
function renderKeywordNetwork(keywords) {
    let keywordDiv = document.getElementById("keywordNetwork");
    keywordDiv.innerHTML = "";  // 清空旧的内容

    let network = document.createElement("ul");
    keywords.forEach(word => {
        let li = document.createElement("li");
        li.textContent = word;
        li.style.listStyle = "none";
        li.style.padding = "5px";
        li.style.fontSize = "18px";
        li.style.fontWeight = "bold";
        network.appendChild(li);
    });

    keywordDiv.appendChild(network);
}
