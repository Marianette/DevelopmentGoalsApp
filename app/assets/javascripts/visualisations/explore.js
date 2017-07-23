// Information updates for choropleth map page
function updateMapTitleAndInfo(dataset, filter){
  var title = '';
  var info = '';

  switch(dataset) {
    case "education": title = "Secondary Education";
    switch(filter) {
      case "female":
      info = "Percentage of female population (ages 25+) with at least some secondary education.";
      break;
      case "male":
      info = "Percentage of male population (ages 25+) with at least some secondary education.";
      break;
      default:
      info = "The difference between males (% population) and females (% population) with at least some secondary education.";
    }
    break;
    case "employment": title = "Labour Force Participation";
    switch(filter) {
      case "female":
      info = "Labor force participation rate of females (% of female population ages 15+).";
      break;
      case "male":
      info = "Labor force participation rate of males (% of male population ages 15+).";
      break;
      default:
      info = "The difference between the labour force participation rates of males and females.";
    }
    break;
    default: title = "Education vs. Employment";
    switch(filter) {
      case "female":
      info = "Difference between female population in labour force and % of females with at least some secondary education.";
      break;
      default:
      info = "Difference between male population in labour force and % of males with at least some secondary education.";
    }
  }
  // Add text updates
  $('#data-name').text(title);
  $('#data-info').text(info);
}
