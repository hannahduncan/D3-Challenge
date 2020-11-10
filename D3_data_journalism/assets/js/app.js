// Set SVG dimensions
var svgWidth = 860;
var svgHeight = 660;

// Set chart margins
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 60,
    left: 60
};

// Set chart dimensions 
var chartWidth = svgWidth - (chartMargin.left + chartMargin.right);
var chartHeight = svgHeight - (chartMargin.top + chartMargin.bottom);

// Append svg to html page
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Define chart group
var chartGroup = svg.append("g")
    .attr("transform",`translate(${chartMargin.left},${chartMargin.top})`);

// Load data
var filePath = "assets/data/data.csv"
d3.csv(filePath).then(processData);

// Function to process data 
function processData(data) {
    // Parse Poverty and Lacks Healthcare information as numbers
    data.forEach( function(d) {
        d.poverty = +d.poverty;
        d.healthcareLow = +d.healthcareLow;
    })

    // Create Poverty % label for x axis
    var poverty = data.map(d => d.poverty);
    poverty.sort((first,second) => first-second);
    console.log(poverty)

    // Create xScale
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(poverty)])
        .range([0,chartWidth]);
    
    // Create yScale
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcareLow)])
        .range([chartHeight,0]);
    
    // Set axes
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale);

    // Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);
    chartGroup.append("g").call(yAxis);

    // Crate circle group
    var circleGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        
    // Append circles to circle group
    var circles = circleGroup.append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcareLow))
        .attr("r", 15)

    // Append text to circle group
    circleGroup.append("text")
        .text(d => d.abbr)
        .attr("class","stateText")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcareLow) + 5)
    
    // Create tooltip object
    var tooltip = d3.tip()
        .attr("class", "tooltip")
        .offset([10,-10])
        .html(function(d) {
            return (`State: ${d.state} </br> Poverty Rate: ${d.poverty}% </br> Lacks Healthcare: ${d.healthcareLow}%`)
        })

    // Call tooltip
    chartGroup.call(tooltip);
    
    // Create event listeners
    circles.on("mouseover", function(d) {
        tooltip.show(d, this)
    })
    circles.on("mouseout", function(d) {
            tooltip.hide(d, this)
    })
    
    // Add axis titles
    chartGroup.append("text")
        .attr("transform", `translate( ${chartWidth/2}, ${chartHeight + chartMargin.top + 16})`)
        .text("Poverty Rate (%)")
        .style("font-weight","bold")
    
    chartGroup.append("text")
        .attr("x", 0- (chartHeight/2 + chartMargin.bottom))
        .attr("y", 0 - chartMargin.left + 24)
        .attr("transform","rotate(-90)")
        .text("Lacks Healthcare (%)")
        .style("font-weight","bold")

};

