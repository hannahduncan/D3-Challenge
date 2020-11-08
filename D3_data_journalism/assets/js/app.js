// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 660;

var chartMargin = {
    top: 30,
    right: 30,
    bottom: 60,
    left: 60
};

var chartWidth = svgWidth - (chartMargin.left + chartMargin.right);
var chartHeight = svgHeight - (chartMargin.top + chartMargin.bottom);

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${chartMargin.left},${chartMargin.top})`);



var filePath = "assets/data/data.csv"
d3.csv(filePath).then(processData);

function processData(data) {
    console.log(data);
    data.forEach( function(d) {
        d.poverty = parseInt(d.poverty);
        d.healthcareLow = parseInt(d.healthcareLow);

    })
    
    var attributes = Object.keys(data[0]);
    console.log(attributes);
    
    var poverty = data.map(d => d.poverty);
    poverty.sort((first,second) => first-second);
    var healthcareLow = data.map(d => d.healthcareLow);
    var names = data.map(d => d.state)
    console.log(poverty);
    console.log(healthcareLow);
    console.log(names);

    var xScale = d3.scaleBand()
        .domain(poverty)
        .range([0,chartWidth])
        .padding(.025);
    
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcareLow)])
        .range([chartHeight,0]);

    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);
    chartGroup.append("g").call(yAxis);

    var circleGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcareLow))
        .attr("r", 15)

    // QUESTION: Text is appended to circle objects, but not displaying in circle
    circleGroup.append("text")
        .text(d => d.abbr)
        .attr("class","stateText")

    chartGroup.append("text")
        .attr("transform", `translate( ${chartWidth/2}, ${chartHeight + chartMargin.top + 16})`)
        .text("Poverty Rate (%)")
        .style("font-weight","bold")
    
    chartGroup.append("text")
        .attr("x", 0- (chartHeight/2))
        .attr("y", 0 - chartMargin.left + 24)
        .attr("transform","rotate(-90)")
        .text("Lacks Healthcare (%)")
        .style("font-weight","bold")



};

