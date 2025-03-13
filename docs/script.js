const API_URL = "https://unicc-nyu-siyige.onrender.com/upload_text";

function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];
    if (!file) {
        alert("请选择一个文件");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    fetch(API_URL, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        renderWordCloud(data.keywords);
        renderSentimentChart(data.sentiment);
        renderKeywordNetwork(data.keyword_network);
        renderSourceTrend(data.time_series);
        renderMediaActivity(data.source_distribution);
    })
    .catch(error => console.error("Error:", error));
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
