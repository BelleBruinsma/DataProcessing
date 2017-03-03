/*
student: Belle Bruinsma
student number: 10676759
datum: 3 maart 2017
data processing: map in d3 
*/

window.onload = function() {
	// based on: https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
	// load the json data and put it into the array 'series'
	var series =[];
	d3.json("GDP.json", function(error, data) {
    	if (error) throw (error);
    	data.forEach(function(d) {
    		// change strings into real numbers
    		d.dollars = +d.dollars
    		// colors should be uniq for every value
    		colormaker = function(dollars){
    			if (dollars > 0 && dollars < 1000000){
    				return "#dadaeb"}
    			else if (dollars > 1000000 && dollars < 2000000){
    				return "#bcbddc"}
    			else if (dollars > 2000000 && dollars < 4000000){
    				return "#9e9ac8"}
    			else if (dollars > 4000000 && dollars < 8000000){
    				return "#756bb1"}
    			else if (dollars > 8000000){
    				return "#54278f"}	
    		}
    	// create new array with prefered format
    	series.push([d.cntr, d["country"], d.dollars, colormaker(d.dollars)]);
		});

		var dataset = {};    
    		// fill dataset in appropriate format with fillcolors included
    		series.forEach(function(item){ 
         		var foo = item[0],
         			land = item[1];
                	gdp = item[2];
                	fillColor = item[3]; 
        	dataset[foo] = { GDP: gdp, fillColor: fillColor, Economy: land };
		});

		// based on: https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html
		// draw map
		new Datamap({
        	element: document.getElementById('container'),
        	projection: 'mercator', 
        	fills: { defaultFill: '#F5F5F5' },
        	data: dataset,
        	history: series,
        	geographyConfig: {
            	borderColor: '#DEDEDE',
            	highlightBorderWidth: 2,
            	// don't change color on mouse hover
            	highlightFillColor: function(geo) {
                	return geo['fillColor'] || '#F5F5F5';
            	},
            	// change border color on mouseover
            	highlightBorderColor: '#42a844',
            	// show info tooltip
            	popupTemplate: function(geo, data) {
                	// if country not present in dataset
                	if (!data) { return ['<div class="hoverinfo">',
                    	'No data available for this region',
                    	'</div>'].join('');}
                	// tooltip info GDP
                	return ['<div class="hoverinfo">',
                    	'<strong>', geo.properties.name, '</strong>',
     					'<br>GDP: $<strong>', data.GDP/1000000,'</strong>', ' million',
                    	'</div>'].join('');   
            	}
        	}
    	});
	});
};