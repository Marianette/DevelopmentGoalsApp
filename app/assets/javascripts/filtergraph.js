scatterplot = function (data) {
  var sales_chart  = dc.lineChart("#linegraph");
  var yearly_sales = dc.pieChart("#piechart");
  var data_table = dc.dataTable("#data-table");

  var ndx = crossfilter(data);

  // Create specifc data parser
  var dateFormat = d3.time.format("%d/%m/%Y");

  // Manipulate input data. Reformat date and add new field.
  data.forEach(function (d) {
    d.date = dateFormat.parse(d.date);
    d.total = d.books + d.movies + d.chocolate;
    d.year = d.date.getFullYear();
  });

  var dateDim = ndx.dimension(function (d) {
    return d.date;
  });

  var yearDim = ndx.dimension(function (d) {
    return d.year;
  });

  var total_sales = dateDim.group().reduceSum(function (d) { return d.total;});
  var year_total_sales = yearDim.group().reduceSum(function (d) { return d.total;});

  // create groupings for each different type of sale for the linegraph
  var books = dateDim.group().reduceSum(function (d) {return d.books;});
  var movies = dateDim.group().reduceSum(function (d) {return d.movies;});
  var chocolate = dateDim.group().reduceSum(function (d) {return d.chocolate;});

  var minDate = dateDim.bottom(1)[0].date;
  var maxDate = dateDim.top(1)[0].date;

  sales_chart
    .width(800).height(300)
    .dimension(dateDim)
    // .group(total_sales) - show 1 line with total sales
    .group(books, "Books")
    .stack(movies, "Movies")
    .stack(chocolate, "Chocolates")
    .renderArea(true)  // shades in the area under the graph
    .x(d3.time.scale().domain([minDate, maxDate]))
    .yAxisLabel("Sales per day")
    .xAxisLabel("Date")
    .legend(dc.legend().x(50).y(10).itemHeight(15).gap(5));

  yearly_sales
    .width(150).height(150)
    .dimension(yearDim)
    .group(year_total_sales)
    .innerRadius(20);

  data_table
    .dimension(dateDim)
    .group(function (d) { return d.year;})   // group table elements by year
    .columns([
        function (d) {
          return d.date.getDate() + "/" + (d.date.getMonth() + 1) + "/" + d.date.getFullYear();
        },
        function (d) { return d.books; },
        function (d) { return d.movies; },
        function (d) { return d.chocolate; }
    ]);

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
