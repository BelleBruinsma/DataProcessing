// Belle Bruinsma 10676759
// inspired by: http://jsfiddle.net/6cJ5c/45/

window.onload = function() {
	
	// width and height barchart
	var margin = {top: 20, right: 30, bottom: 80, left: 50},
		width = 1000 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom,
		y = d3.scaleLinear().range([height, 0]),
		x = d3.scaleTime().range([0, width]);
	var svg = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// lines for the females, males and children
	var Females_line = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.Females); });
	var Children_line = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.Children); });
	var Males_line = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.Males); });
	
	// define the date variable
	var focus = svg.append("g")
		.style("display", "none");
	var bisectDate = d3.bisector(function(d) { return d.date; }).left;
	var formatDate = d3.timeFormat("%Y");
		
	// make the linegraph for vegetables
	d3.json("vegat.json", function(error, data) {
		data.forEach(function(d) {
			d.date = Date.parse(d.date);
			d.Females = +d.Females;
			d.Males = +d.Males;
			d.Children = +d.Children;
		});

		// define the x and y as
		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([0, d3.max(data, function(d) { return d.Females; })]);
		
		var xAxis = d3.axisBottom()
			.scale(x)
			.tickFormat(d3.timeFormat("%Y"))
		
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
			
		svg.append("g")
			.call(d3.axisLeft(y))
			.append("text")
			  .attr("fill", "#000")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", "0.75em")
			  .attr("text-anchor", "end")
			  .text("Number of fruit and vegetables");
		
		// Add the lines path.
		svg.append("path")
			.attr("class", "Veg_Females")
			.attr("d", Females_line(data))
			.attr("fill", "none")
			.attr("stroke", "#ff80ff")
			.attr("display", "block")
			.attr("stroke-width", 1);	
		svg.append("path")
			.attr("class", "Veg_Children")
			.attr("d", Children_line(data))
			.attr("fill", "none")
			.attr("stroke", "#e600e6")
			.attr("stroke-width", 1);
		svg.append("path")
			.attr("class", "Veg_Males")
			.attr("d", Males_line(data))
			.attr("fill", "none")
			.attr("stroke", "#660066")
			.attr("stroke-width", 1);
		
		// append circle at the intersection
		focus.append("circle")
			.attr("class", "y")
			.attr("r", 4)
			.style("stroke", "black")
			
		// place the value at the intersection
		focus.append("text")
			.attr("class", "y1")
			.style("stroke", "black")
			.style("stroke-width", "1px")
			.style("opacity", 0.8)
			.attr("dx", 8)
			.attr("dy", "-.3em");
		
		// append the rect that listens to mousemovements
		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function() { focus.style("display", null); })
			.on("mouseout", function() { focus.style("display", "none"); })
			.on("mousemove", mousemove);  
		
		function mousemove() {                                 
			var x0 = x.invert(d3.mouse(this)[0]),
				i = bisectDate(data, x0, 1),
				d0 = data[i - 1],                              
				d1 = data[i],                                  
				d = x0 - d0.date > d1.date - x0 ? d1 : d0;
			
			// move the circle and text to the appropriate location
			focus.select("circle.y")                          
				.attr("transform",                           
                  "translate(" + x(d.date) + "," +         
                                 y(d.Females) + ")");	
			focus.select("text.y1")
				.attr("transform",
					"translate(" + x(d.date) + "," +
								   y(d.Females) + ")")
				.text(formatDate(d.date) + " Vegetables: " + d.Females);
		};
	});
	
	// make the linegraph for fruits
	d3.json("fruit1.json", function(error, data) {
		data.forEach(function(d) {
			d.date = Date.parse(d.date);
			d.Females = +d.Females;
			d.Males = +d.Males;
			d.Children = +d.Children;
		});
		
		// Add the lines path.
		svg.append("path")
			.attr("class", "Fr_Females")
			.attr("d", Females_line(data))
			.attr("fill", "none")
			.attr("stroke", "#9fdf9f")
			.attr("stroke-width", 1);	
		svg.append("path")
			.attr("class", "Fr_Children")
			.attr("d", Children_line(data))
			.attr("fill", "none")
			.attr("stroke", "#40bf40")
			.attr("stroke-width", 1);
		svg.append("path")
			.attr("class", "Fr_Males")
			.attr("d", Males_line(data))
			.attr("fill", "none")
			.attr("stroke", "#206020")
			.attr("stroke-width", 1);
	});
	
	// toggles the lines on and off when checkbox is clicked
	d3.selectAll("input").on('click', function() {
		var toggle = this.value;
		if(this.checked) {
			d3.select("." + toggle)
				.attr("display", "block")
		} else {
			d3.select("." + toggle)
				.attr("display", "none");
		}
	});
}