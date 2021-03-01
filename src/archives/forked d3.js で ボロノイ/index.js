"use strict";

var width = window.innerWidth;
var height = window.innerHeight;
var margin = 10;

var color = d3.scale.category20c();

var point = [];

for (var k = 0; k < 50; k++) {
  var x = margin + (width - 2 * margin) * Math.random();
  var y = margin + (height - 2 * margin) * Math.random();
  point.push([x, y]);
}

(function () {
  var svg = d3.select("#MyGraph").attr("width", width).attr("height", height);

  var voronoiData = d3.geom.voronoi();
  console.log(voronoiData(point));

  var voronoiPath = svg.selectAll("path").data(voronoiData(point)).enter().append("path").attr("class", "voronoi").attr("d", function (d, i) {
    return "M" + d.join("L") + "Z";
  }).style("stroke", "white").style("stroke-width", 1).style("fill-opacity", 0.4).style("fill", function (d, i) {
    return color(i);
  });

  var pointElement = svg.selectAll("circle").data(point).enter().append("circle").attr("cx", function (d, i) {
    return d[0];
  }).attr("cy", function (d, i) {
    return d[1];
  }).attr("r", 2).attr("fill", "black");
})();

