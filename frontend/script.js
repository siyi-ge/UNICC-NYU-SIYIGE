function uploadFile(type) {
    let fileInput;
    let apiUrl;

    if (type === "text") {
        fileInput = document.getElementById("textFile").files[0];
        apiUrl = "https://unicc-nyu-siyige.onrender.com/upload_text";
    } else if (type === "audio") {
        fileInput = document.getElementById("audioFile").files[0];
        apiUrl = "https://unicc-nyu-siyige.onrender.com/upload_text";
    } else if (type === "video") {
        fileInput = document.getElementById("videoFile").files[0];
        apiUrl = "https://unicc-nyu-siyige.onrender.com/upload_text";
    }

    if (!fileInput) {
        alert("请选择一个文件");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput);

    fetch(apiUrl, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("analysisType").innerText = type.toUpperCase();
        document.getElementById("score").innerText = data.xenophobia_score;
        document.getElementById("keywords").innerText = data.keywords.join(", ");
        document.getElementById("sentiment").innerText = data.sentiment;

        updateProgressBar(data.xenophobia_score);
        updateKeywordsChart(data.keywords);
        updateSentimentChart(data.sentiment);
    })
    .catch(error => console.error("Error:", error));
}

// 更新进度条
function updateProgressBar(score) {
    let progressBar = document.getElementById("progressBar");
    progressBar.style.width = (score * 10) + "%";
    progressBar.innerText = score;
}

// 更新关键词条形图
function updateKeywordsChart(keywords) {
    let ctx = document.getElementById("keywordsChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: keywords,
            datasets: [{
                label: "关键词权重",
                data: keywords.map(() => Math.random() * 10), // 模拟权重
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }]
        }
    });
}

// 更新情感分析饼图
function updateSentimentChart(sentiment) {
    let ctx = document.getElementById("sentimentChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Positive", "Neutral", "Negative"],
            datasets: [{
                data: sentiment === "positive" ? [70, 20, 10] :
                      sentiment === "neutral" ? [30, 50, 20] : [10, 20, 70],
                backgroundColor: ["green", "gray", "red"]
            }]
        }
    });
}
