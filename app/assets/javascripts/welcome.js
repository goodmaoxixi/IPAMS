var width  = 732;
var height = 732;
var radius = Math.min(width, height) / 2;

var loadData = function(cmd) {
  $.ajax({
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    url: '/welcome',
    dataType: 'json',
    success: function(data) { drawOrUpdate(data, cmd); }, 
    failure: function(result) { error(); }
  });
};

var drawOrUpdate = function(data, cmd) {
  //console.log(data);
  if (cmd == "draw_donut") {
    drawSunburst(data);
  } else if (cmd == "update_page") {
    updatePage(data);
  } else {
    console.log("Unrecognized command: " + cmd);
  }
};

function error() {
  console.log("Something went wrong!");
}

var drawSunburst = function(data) {
  console.log(data);
  //var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow,
  //                                        data.children.length + 1));

  var color = d3.scaleOrdinal()
                .domain(data)
                .range(d3.schemeSet3);

  var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('width', 'auto')
    .style('height', 'auto')
    .style('font', '10px sans-serif')
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

  // Formats the Data
  var partition = d3.partition()
		                .size([2 * Math.PI, radius]);

  // Finds the Root Node
  var root = d3.hierarchy(data)
               .sum(function(d) { return d.size });

  // For efficiency, filter nodes to keep only those large enough to see.
  // 0.005 radians = 0.29 degrees
  var nodes = partition(root).descendants()
                             .filter(function(d) {
			                         return (d.x1 - d.x0 > 0.005);
			                       });

  // Calculates each arc
  var arc = d3.arc()
              .startAngle(function(d) { return d.x0; })
              .endAngle(function(d) { return d.x1; })
              .innerRadius(function(d) { return d.y0; })
              .outerRadius(function(d) { return d.y1; });

  svg.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr("class", "node")
      .append('path')
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .style('stroke', '#fff')
      .style("fill", function(d) {
	      return color((d.children ? d : d.parent).data.name);
      });

  // Add a Label for Each Node
  svg.selectAll(".node")
     .append("text")
     .attr("transform", function(d) {
     	 return "translate(" + arc.centroid(d) +
     	        ")rotate(" + computeTextRotation(d) + ")";
     })
     .attr("dx", "6") // margin
     .attr("dy", ".35em")
     .attr("text-anchor", "middle")
     //.style('stroke-width', 5)
     .text(function(d) { return d.parent ? d.data.name : ""; });
};

function computeTextRotation(d) {
  var angle = (d.x0 + d.x1) / Math.PI * 90;
  // Avoids upside-down labels. Labels aligned with slices.
  //return (angle < 90 || angle > 270) ? angle : angle + 180;

  // Alternate label formatting, in the radian direction
  return (angle < 180) ? angle - 90 : angle + 90;
}

var updatePage = function(data) {
};

