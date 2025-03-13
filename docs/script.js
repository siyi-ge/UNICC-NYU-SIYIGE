document.getElementById("uploadBtn").addEventListener("click", uploadFile);

let apiData = null; // 存储 API 返回的数据

function uploadFile() {
    let formData = new FormData();
    let fileInput = document.getElementById("fileInput").files[0];

    if (!fileInput) {
        alert("请先选择一个文件！");
        return;
    }
    
    formData.append("file", fileInput);

    fetch("https://unicc-nyu-siyige.onrender.com/upload_text", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("API 返回的数据:", data);
        apiData = data;  // 存储数据到全局变量

        // 渲染可视化图表
        renderWordCloud(data.keywords);
        renderSentimentDistribution(data.sentiment);
        renderKeywordNetwork(data.keywords);
    })
    .catch(error => {
        console.error("API 请求失败:", error);
        alert("API 请求失败，请检查控制台日志");
    });
}

// 词云
function renderWordCloud(keywords) {
    let wordCloudContainer = document.getElementById("wordCloud");
    wordCloudContainer.innerHTML = ""; // 清空旧内容

    let wordCloudData = keywords.map(word => ({ text: word, size: Math.random() * 40 + 10 }));

    let svg = d3.select("#wordCloud")
        .append("svg")
        .attr("width", 300)
        .attr("height", 200);

    let layout = d3.layout.cloud()
        .size([300, 200])
        .words(wordCloudData)
        .padding(5)
        .rotate(() => 0)
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        svg.append("g")
            .attr("transform", "translate(150,100)")
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

// 情感分布
function renderSentimentDistribution(sentiment) {
    let sentimentContainer = document.getElementById("sentimentChart");
    sentimentContainer.innerHTML = ""; // 清空旧内容

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

// 关键词网络
function renderKeywordNetwork(keywords) {
    let networkContainer = document.getElementById("keywordNetwork");
    networkContainer.innerHTML = ""; // 清空旧内容

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
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnd(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}
