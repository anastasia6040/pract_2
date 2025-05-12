function createArrGraph(data, key, showMin, showMax) {
    groupObj = d3.group(data, d => d[key]);
    let arrGraph = [];

    for (let entry of groupObj) {
        let dates = entry[1].map(d => d['Дата выхода']);  // Изменено: 'Высота' → 'Дата выхода'
        let minMax = d3.extent(dates);
        let values = [];

        if (showMin) values.push(minMax[0]);
        if (showMax) values.push(minMax[1]);

        // Убрана сортировка по году, так как теперь работаем со страной/жанром
        let label = entry[0];  // Убрано условие для "Год"

        arrGraph.push({
            labelX: label,
            values: values,
            originalLabel: entry[0]
        });
    }

    // Убрана сортировка по году
    return arrGraph;
}

// Функция drawGraph не требует изменений, остается как есть
function drawGraph(data, keyX, showMin, showMax, chartType = "scatter") {
    const arrGraph = createArrGraph(data, keyX, showMin, showMax);

    let svg = d3.select("svg");
    svg.selectAll('*').remove();

    attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    }

    const [scX, scY] = createAxis(svg, arrGraph, attr_area, keyX);

    if (chartType === "scatter") {
        createChart(svg, arrGraph, scX, scY, attr_area, null, showMin, showMax);
    } else if (chartType === "bar") {
        createBarChart(svg, arrGraph, scX, scY, attr_area, null, showMin, showMax);
    }
}

// Функция createAxis не требует изменений, остается как есть
function createAxis(svg, data, attr_area, keyX) {
    const allValues = data.flatMap(d => d.values);
    const [min, max] = d3.extent(allValues);

    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.originalLabel))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.1);

    let scaleY = d3.scaleLinear()
        .domain([min, max])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    let axisX = d3.axisBottom(scaleX);
    let axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
}

// Функции createChart и createBarChart не требуют изменений, остаются как есть
function createChart(svg, data, scaleX, scaleY, attr_area, color, showMin, showMax) {
    const r = 4;
    const colors = {
        min: "blue",
        max: "red"
    };

    if (showMin) {
        svg.selectAll(".dot-min")
            .data(data.filter(d => d.values.length > 0))
            .enter()
            .append("circle")
            .attr("class", "dot-min")
            .attr("r", r)
            .attr("cx", d => scaleX(d.originalLabel) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", colors.min);
    }

    if (showMax) {
        svg.selectAll(".dot-max")
            .data(data.filter(d => d.values.length > (showMin ? 1 : 0)))
            .enter()
            .append("circle")
            .attr("class", "dot-max")
            .attr("r", r)
            .attr("cx", d => scaleX(d.originalLabel) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[showMin ? 1 : 0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", colors.max);
    }
}

function createBarChart(svg, data, scaleX, scaleY, attr_area, color, showMin, showMax) {
    const barWidth = scaleX.bandwidth() / (showMin && showMax ? 2 : 1);
    const colors = {
        min: "blue",
        max: "red"
    };

    if (showMin) {
        svg.selectAll(".bar-min")
            .data(data.filter(d => d.values.length > 0))
            .enter()
            .append("rect")
            .attr("class", "bar-min")
            .attr("x", d => scaleX(d.originalLabel) + (showMax ? 0 : barWidth / 2))
            .attr("y", d => scaleY(d.values[0]))
            .attr("width", barWidth)
            .attr("height", d => attr_area.height - attr_area.marginY * 2 - scaleY(d.values[0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", colors.min);
    }

    if (showMax) {
        svg.selectAll(".bar-max")
            .data(data.filter(d => d.values.length > (showMin ? 1 : 0)))
            .enter()
            .append("rect")
            .attr("class", "bar-max")
            .attr("x", d => scaleX(d.originalLabel) + (showMin ? barWidth : barWidth / 2))
            .attr("y", d => scaleY(d.values[showMin ? 1 : 0]))
            .attr("width", barWidth)
            .attr("height", d => attr_area.height - attr_area.marginY * 2 - scaleY(d.values[showMin ? 1 : 0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", colors.max);
    }
}