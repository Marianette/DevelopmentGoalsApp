// Following code from : http://bl.ocks.org/rgdonohue/9280446

var width, height, projection, path, centered, svg, toolTipDiv, attributeArray = [], currentAttribute = 0, playing = false;

function initSchoolVisualisation(id) {
  createMap(id);
  setAnimataion();
}

function createMap(id) {
  width = 960;
  height = 500;
  offset = 30;

  // define projection with parameters
  projection = d3.geo.naturalEarth()
    .scale(180)
    .translate([width / 2, height / 2 + offset])
    .precision(.1);

  // create path generator function
  path = d3.geo.path()
    .projection(projection);

  svg = d3.select(id).append("svg")
      .attr("width", width)
      .attr("height", height);

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

    svg.selectAll(".country")   // select country objects (which don't exist yet)
      .data(topojson.feature(world, world.objects.countries).features)  // bind data to these non-existent objects
      .enter().append("path") // prepare data to be appended to paths
      .attr("class", "country") // give them a class for styling and access later
      .attr("id", function(d) { return "code_" + d.properties.id; }, true)  // give each a unique id for access later
      .attr("d", path); // create them using the svg path generator defined above

    var dataRange = getDataRange(); // get the min/max values from the current year's range of data values
    d3.selectAll('.country')  // select all the countries
    .attr('fill-opacity', function(d) {
        return getColor(d.properties[attributeArray[currentAttribute]], dataRange);  // give them an opacity value based on their current value
    })
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip)
    .on('click', clicked);
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
// TODO change zoom calculation. put div in table to prevent map being drawn out.
function clicked(d){
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  svg.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  svg.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

function sequenceMap() {

    var dataRange = getDataRange(); // get the min/max values from the current year's range of data values
    d3.selectAll('.country').transition()  //select all the countries and prepare for a transition to new values
      .duration(750)  // give it a smooth time period for the transition
      .attr('fill-opacity', function(d) {
        return getColor(d.properties[attributeArray[currentAttribute]], dataRange);  // the end color value
      })

}

function getColor(valueIn, valuesIn) {

  var color = d3.scale.linear() // create a linear scale
    .domain([valuesIn[0],valuesIn[1]])  // input uses min and max values
    .range([.3,1]);   // output for opacity between .3 and 1 %

  return color(valueIn);  // return that number to the caller
}

function getDataRange() {
  // function loops through all the data values from the current data attribute
  // and returns the min and max values

  var min = Infinity, max = -Infinity;
  d3.selectAll('.country')
    .each(function(d,i) {
      var currentValue = d.properties[attributeArray[currentAttribute]];
      if(currentValue <= min && currentValue != -99 && currentValue != 'undefined') {
        min = currentValue;
      }
      if(currentValue >= max && currentValue != -99 && currentValue != 'undefined') {
        max = currentValue;
      }
  });
  return [min,max];  //boomsauce
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
          sequenceMap();  // update the representation of the map
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
