document.addEventListener("DOMContentLoaded", function () {
    let uploadBtn = document.getElementById("uploadBtn");
    if (uploadBtn) {
        uploadBtn.addEventListener("click", uploadFile);
    } else {
        console.error("Error: Upload button not found!");
    }
});

let apiData = null; // 全局变量存储 API 返回的数据

function uploadFile() {
    let fileInputElement = document.getElementById("fileInput");
    if (!fileInputElement || !fileInputElement.files.length) {
        alert("请先选择一个文件！");
        return;
    }

    let file = fileInputElement.files[0];
    let formData = new FormData();
    formData.append("file", file);

    fetch("https://unicc-nyu-siyige.onrender.com/upload_text", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("完整的 API 返回数据:", data);
        if (!data || !data.keywords) {
            throw new Error("API 返回的数据无效");
        }
        apiData = data;

        renderWordCloud(data.keywords);
        renderSentimentDistribution(data.sentiment);
        renderKeywordNetwork(data.keywords);
    })
    .catch(error => {
        console.error("API 请求失败:", error);
        alert("API 请求失败，请检查控制台日志");
    });
}

// 🔹 词云
// 确保关键词数据正确处理
function renderWordCloud(keywords) {
    if (!keywords || keywords.length === 0) {
        console.error("词云数据为空");
        return;
    }

    let wordCloudContainer = document.getElementById("wordCloud");
    wordCloudContainer.innerHTML = "<h3>关键词云</h3>";

    let wordCloudData = keywords.map(word => ({ text: word, size: Math.random() * 40 + 10 }));

    let svg = d3.select("#wordCloud")
        .append("svg")
        .attr("width", 400)
        .attr("height", 250);

    let layout = d3.layout.cloud()
        .size([400, 250])
        .words(wordCloudData)
        .padding(5)
        .rotate(() => 0)
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        svg.append("g")
            .attr("transform", "translate(200,125)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", "steelblue")
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .text(d => d.text);
    }
}


// 🔹 情感分析
function renderSentimentDistribution(sentiment) {
    let container = document.getElementById("sentimentChart");
    if (!container) return;
    container.innerHTML = "<h3>情感分析</h3>";

    let data = [
        { sentiment: "Positive", value: sentiment === "positive" ? 1 : 0 },
        { sentiment: "Negative", value: sentiment === "negative" ? 1 : 0 },
        { sentiment: "Neutral", value: sentiment === "neutral" ? 1 : 0 }
    ];

    let svg = d3.select("#sentimentChart")
        .append("svg")
        .attr("width", 200)
        .attr("height", 200);

    let arc = d3.arc().innerRadius(50).outerRadius(100);
    let pie = d3.pie().value(d => d.value);

    let color = d3.scaleOrdinal().domain(data.map(d => d.sentiment))
        .range(["green", "red", "gray"]);

    svg.append("g")
        .attr("transform", "translate(100,100)")
        .selectAll("path")
        .data(pie(data))
        .enter().append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.sentiment));
}

// 🔹 关键词网络
function renderKeywordNetwork(keywords) {
    let container = document.getElementById("keywordNetwork");
    if (!container) return;
    container.innerHTML = "<h3>关键词网络</h3>";

    let nodes = keywords.map((word, i) => ({ id: word, group: i % 3 }));
    let links = keywords.slice(1).map((word, i) => ({ source: keywords[i], target: word }));

    let width = 300, height = 200;

    let svg = d3.select("#keywordNetwork")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2));

    let link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .style("stroke", "#999")
        .style("stroke-width", 1);

    let node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 8)
        .style("fill", "steelblue")
        .call(d3.drag()
            .on("start", dragStart)
            .on("drag", dragged)
            .on("end", dragEnd));

    node.append("title").text(d => d.id);

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x).attr("cy", d => d.y);
    });

    function dragStart(event, d) {
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnd(event, d) {
        d.fx = null;
        d.fy = null;
    }
}
