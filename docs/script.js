const API_URL = "https://unicc-nyu-siyige.onrender.com/upload_text";

function uploadFile(type) {
    let fileInput = document.getElementById("textFile").files[0];
    let apiUrl = "http://127.0.0.1:5000/upload_text";  // 本地 Flask API

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
        console.log("API 返回的数据:", data);

        // 处理 Unicode 编码问题
        let decodedKeywords = data.keywords.map(keyword => decodeURIComponent(escape(keyword)));

        // 在 HTML 页面上显示结果
        document.getElementById("analysisType").innerText = type.toUpperCase();
        document.getElementById("score").innerText = data.xenophobia_score;
        document.getElementById("keywords").innerText = decodedKeywords.join(", ");
        document.getElementById("sentiment").innerText = data.sentiment;
    })
    .catch(error => {
        console.error("发生错误:", error);
        alert("分析失败，请重试");
    });
}


// 1️⃣ 词云
function renderWordCloud(keywords) {
    let chart = echarts.init(document.getElementById("wordCloud"));
    let data = keywords.map(word => ({ name: word, value: Math.random() * 100 }));
    
    let option = {
        series: [{
            type: 'wordCloud',
            data: data
        }]
    };
    chart.setOption(option);
}

// 2️⃣ 情感分布（饼图）
function renderSentimentChart(sentiment) {
    let chart = echarts.init(document.getElementById("sentimentChart"));
    let option = {
        series: [{
            type: 'pie',
            data: [
                { value: sentiment.positive, name: "Positive" },
                { value: sentiment.negative, name: "Negative" },
                { value: sentiment.neutral, name: "Neutral" }
            ]
        }]
    };
    chart.setOption(option);
}

// 3️⃣ 关键词网络（模拟数据）
function renderKeywordNetwork(data) {
    let chart = echarts.init(document.getElementById("keywordNetwork"));
    let option = {
        series: [{
            type: 'graph',
            layout: 'force',
            nodes: data.nodes,
            links: data.links
        }]
    };
    chart.setOption(option);
}

// 4️⃣ 信息来源趋势（折线图）
function renderSourceTrend(data) {
    let chart = echarts.init(document.getElementById("sourceTrend"));
    let option = {
        xAxis: { type: 'category', data: data.dates },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: data.values }]
    };
    chart.setOption(option);
}

// 5️⃣ 媒体活跃度（环形图）
function renderMediaActivity(data) {
    let chart = echarts.init(document.getElementById("mediaActivity"));
    let option = {
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: data
        }]
    };
    chart.setOption(option);
}


