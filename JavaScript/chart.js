// Создание массива данных для графика на основе группировки по ключу
function createArrGraph(data, key, showMin, showMax) {
    // Группируем данные по значению key
    groupObj = d3.group(data, d => d[key]);
    let arrGraph = [];

    // Проходим по каждой группе
    for (let entry of groupObj) {
        let dates = entry[1].map(d => d['Дата выхода']);
        let minMax = d3.extent(dates); // Находим минимальную и максимальную дату
        let values = [];

        if (showMin) values.push(minMax[0]); // Добавляем минимальное значение
        if (showMax) values.push(minMax[1]); // Добавляем максимальное значение

        let label = entry[0];

        arrGraph.push({
            labelX: label,
            values: values,
            originalLabel: entry[0] // Сохраняем исходную метку для оси X
        });
    }

    return arrGraph;
}

// Главная функция для отрисовки графика
function drawGraph(data, keyX, showMin, showMax, chartType = "scatter") {
    // Подготовка данных для графика
    const arrGraph = createArrGraph(data, keyX, showMin, showMax);

    let svg = d3.select("svg");
    svg.selectAll('*').remove(); // Очищаем SVG перед отрисовкой

    // Параметры области графика
    attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    }

    // Создаем оси и шкалы
    const [scX, scY] = createAxis(svg, arrGraph, attr_area, keyX);

    // Вызов соответствующей функции отрисовки
    if (chartType === "scatter") {
        createChart(svg, arrGraph, scX, scY, attr_area, null, showMin, showMax);
    } else if (chartType === "bar") {
        createBarChart(svg, arrGraph, scX, scY, attr_area, null, showMin, showMax);
    } else if (chartType === "line") {
        createLineChart(svg, arrGraph, scX, scY, attr_area, showMin, showMax);
    }
}


// Создание шкал и осей
function createAxis(svg, data, attr_area, keyX) {
    // Все значения Y (даты) объединяем в один массив
    const allValues = data.flatMap(d => d.values);
    const [min, max] = d3.extent(allValues);

    // Дискретная шкала по X (категории)
    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.originalLabel))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.1);

    // Непрерывная шкала по Y (даты)
    let scaleY = d3.scaleLinear()
        .domain([min, max])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    // Создание и добавление осей
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

// Создание точечного графика (scatter)
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

// Создание столбчатого графика (bar)
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

// Создание линейного графика (line) с точками
function createLineChart(svg, data, scaleX, scaleY, attr_area, showMin, showMax) {
    const colors = {
        min: "blue",
        max: "red"
    };

    if (showMin) {
        const dataMin = data.filter(d => d.values.length > 0);

        svg.append("path")
            .datum(dataMin)
            .attr("class", "line-min")
            .attr("fill", "none")
            .attr("stroke", colors.min)
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => scaleX(d.originalLabel) + scaleX.bandwidth() / 2 + attr_area.marginX)
                .y(d => scaleY(d.values[0]) + attr_area.marginY)
            );
    }

    if (showMax) {
        const dataMax = data.filter(d => d.values.length > (showMin ? 1 : 0));

        svg.append("path")
            .datum(dataMax)
            .attr("class", "line-max")
            .attr("fill", "none")
            .attr("stroke", colors.max)
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => scaleX(d.originalLabel) + scaleX.bandwidth() / 2 + attr_area.marginX)
                .y(d => scaleY(d.values[showMin ? 1 : 0]) + attr_area.marginY)
            );
    }
}