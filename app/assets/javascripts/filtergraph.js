scatterplot = function (data) {
  var sales_chart  = dc.lineChart("#linegraph");
  var ndx = crossfilter(data);

  // Create specifc data parser
  var dateFormat = d3.time.format("%d/%m/%Y");

  // Manipulate input data. Reformat date and add new field.
  data.forEach(function (d) {
    d.date = dateFormat.parse(d.date);
    d.total = d.books + d.movies + d.chocolate;
  });

  var dateDim = ndx.dimension(function (d) {
    return d.date;
  });

  var total_sales = dateDim.group().reduceSum(function (d) { return d.total;});
  var minDate = dateDim.bottom(1)[0].date;
  var maxDate = dateDim.top(1)[0].date;

  sales_chart
    .width(800).height(300)
    .dimension(dateDim)
    .group(total_sales)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .yAxisLabel("Sales per day")
    .xAxisLabel("Date");

  dc.renderAll();

/** CROSS FILTER PRACTISE **
  // If data has a date, total, tips and type field:

  // Get all transactions
  var totalDim = ndx.dimension(function(d) {
    return d.total;
  });

  // Filter the dimension to find all that equal 90
  var total90 = totalDim.filter(90);  // same as using filter exact

  // Filter from 91 to 100 inclusive
  var totalto100 = totalDim.filter([91,100]);

  // Can even specify filters with functions
  var div3 = totalDim.fitler(function (d) {
    if (d%3 == 0) {return d; }
  });

  // Filter on strings
  var typeDim = ndx.dimension(function(d) {
    return d.type;
  });
  var visaFilter = typeDim.filter("visa");
  var cashFilter = typeDim.filter("cash");

  // Get total for cash (get total of all cash payments)
  var cashTotal = ndx.groupAll().reduceSum(function (d) {
    return d.total;
  }).value();

  // typeDim.filterAll() to clear filters
**/
}
