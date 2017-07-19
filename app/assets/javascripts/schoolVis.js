// Position variables
var width, height, centerX, centerY;

// Map view variables
var projection, path, svg, container, toolTipDiv, colScale;

var centered, attributeArray = [], currentAttribute = 0, playing = false;

function initSchoolVisualisation(id) {
  createMap(id);
  setAnimataion();
}

function createMap(id) {
  width = 960;
  height = 500;

  var xoffset = 60;
  var yoffset = 45;

  centerX = width/2 - xoffset;
  centerY = height/2 + yoffset;

  // define projection with parameters
  projection = d3.geo.naturalEarth()
  .scale(180)
  .translate([centerX, centerY])
  .precision(.1);

  // create path generator function
  path = d3.geo.path()
  .projection(projection);

  svg = d3.select(id).append("svg")
  .attr("width", width)
  .attr("height", height);

  container = svg.append("g");

  var colours = ["#BAE4B3", "#74C476", "#31A354", "#006D2C"];

  // setup colours for choropleth
  colScale = d3.scale.ordinal()
  .range(colours);

  //colScale.domain(d3.extent(data, function (d) { return d.properties[attributeArray[currentAttribute]]; } ));

  toolTipDiv = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  loadSchoolData();
}


function loadSchoolData() {
  queue()
  .defer(d3.json, "../world-topo.json")
  .defer(d3.csv, "../countriesRandom.csv")  // TODO: Temp data set. Change to use secondary school data
  .await(processData);
}

function processData(error,world,countryData) {
  // function accepts any errors from the queue function as first argument, then
  // each data object in the order of chained defer() methods above

  var countries = world.objects.countries.geometries;  // store the path in variable for ease
  for (var i in countries) {    // for each geometry object
    for (var j in countryData) {  // for each row in the CSV
      if(countries[i].properties.id == countryData[j].id) {   // if they match
        for(var k in countryData[i]) {   // for each column in the a row within the CSV
          if(k != 'name' && k != 'id') {  // let's not add the name or id as props since we already have them
          if(attributeArray.indexOf(k) == -1) {
            attributeArray.push(k);  // add new column headings to our array for later
          }
          countries[i].properties[k] = Number(countryData[j][k])  // add each CSV column key/value to geometry object
        }
      }
      break;  // stop looking through the CSV since we made our match
    }
  }
}
// TODO : use two json files, and create diff data here.
// Read female data as json with hash by country name. So fast look up. Add to properites, female, year.
// same for male. loop together. add male, female, calculate diff, and add as well. properities is array[f[years],m[years],b[years]]
d3.select('#clock').html(attributeArray[currentAttribute]);  // populate the clock initially with the current year
drawMap(world);  // let's mug the map now with our newly populated data object
}

function drawMap(world) {
  container.selectAll(".country")
  .data(topojson.feature(world, world.objects.countries).features)
  .enter().append("path")
  .attr("d", path)
  .attr("class", "country")
  .attr("id", function (d) { return "code_" + d.properties.id; })
  .on("click", clicked)
  .on("mouseover", showTooltip)
  .on("mouseout", hideTooltip)
  .style("stroke", "white")
  .style("stroke-width", "0.8px")
  .style("vector-effect", "non-scaling-stroke") // line height won't scale
  .style("fill", function (d,i) { return colScale(d.properties[attributeArray[currentAttribute]]); });

  container.append("path")
  .data(topojson.feature(world, world.objects.countries).features)
  .enter()
  .append("path")
  .attr("class", "mesh")
  .attr("d", path);
}

function showTooltip(d) {
  toolTipDiv.transition()
  .duration(200)
  .style("opacity", .9);
  toolTipDiv.html(d.properties.id + "<br/>" + d.properties[attributeArray[currentAttribute]])
  .style("left", (d3.event.pageX) + "px")
  .style("top", (d3.event.pageY - 28) + "px");
}

function hideTooltip(d) {
  toolTipDiv.transition()
  .duration(500)
  .style("opacity", 0);
}

function clicked(d){
  var dx, dy, scale;
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    dx = centroid[0];
    dy = centroid[1];
    scale = 3;
    centered = d;
  } else {
    dx = centerX;
    dy = centerY;
    scale = 1;
    centered = null;
  }

// TODO highlight on hover

  // Apply zoom into selected country transformation
  container.selectAll("path")
  .classed("active", centered && function(d) { return d === centered; });
  container.transition()
  .duration(750)
  .attr("transform", "translate(" + centerX + "," + centerY + ")scale(" + scale + ")translate(" + -dx + "," + -dy + ")");
}

function setAnimataion() {
  var timer;  // create timer object
  d3.select('#play')
  .on('click', function() {  // when user clicks the play button
    if(playing == false) {  // if the map is currently playing
      timer = setInterval(function(){   // set a JS interval
        if(currentAttribute < attributeArray.length-1) {
          currentAttribute +=1;  // increment the current attribute counter
        } else {
          currentAttribute = 0;  // or reset it to zero
        }

        // update map view
        d3.selectAll('.country').transition()
        .duration(750)
        .style("fill", function (d,i) { return colScale(d.properties[attributeArray[currentAttribute]]); });

        d3.select('#clock').html(attributeArray[currentAttribute]);  // update the clock
      }, 2000);

      d3.select(this).html('stop');  // change the button label to stop
      playing = true;   // change the status of the animation
    } else {    // else if is currently playing
      clearInterval(timer);   // stop the animation by clearing the interval
      d3.select(this).html('play');   // change the button label to play
      playing = false;   // change the status again
    }
  });
}
