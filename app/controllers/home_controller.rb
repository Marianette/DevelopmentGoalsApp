class HomeController < ApplicationController
  def index
  end

  def basic
    respond_to do |format|
      format.json {
        render :json => [1, 2, 3, 4, 5]
      }
    end
  end

  def filters
  data = [
  		{date: "12/02/2017", books: 20, movies: 23, chocolate: 40},
  		{date: "12/12/2016", books: 12, movies: 12, chocolate: 50},
  		{date: "15/12/2016", books: 11, movies: 13, chocolate: 34},
  		{date: "31/01/2017", books: 24, movies: 16, chocolate: 86},
  		{date: "04/02/2017", books: 21, movies: 19, chocolate: 63},
  		{date: "13/02/2017", books: 19, movies: 12, chocolate: 33},
  		{date: "19/02/2017", books: 27, movies: 14, chocolate: 67},
  		{date: "01/01/2017", books: 21, movies: 19, chocolate: 78},
  		{date: "01/12/2016", books: 31, movies: 17, chocolate: 66},
  		{date: "06/11/2016", books: 13, movies: 17, chocolate: 54},
  		{date: "14/11/2016", books: 14, movies: 14, chocolate: 44},
  		{date: "21/11/2016", books: 54, movies: 14, chocolate: 76},
  		{date: "25/12/2016", books: 34, movies: 19, chocolate: 54},
  		{date: "08/10/2016", books: 21, movies: 12, chocolate: 85},
  		{date: "18/10/2016", books: 19, movies: 12, chocolate: 93}
  		]
    respond_to do |format|
      format.json {
        render :json => data
      }
    end
  end

  def motion
    # Nations.json data from https://github.com/lajh87/r2d3MotionChart
    data = JSON.parse(File.read("db/nations.json"))
    respond_to do |format|
      format.json {
        render :json => data
      }
    end
  end

  def force
    # Nodes.json data from https://gist.github.com/mbostock/4062045/d89ba00bbdcc7695b63696902f0f7e95cbe3a679
    data = JSON.parse(File.read("db/nodes.json"))
    respond_to do |format|
      format.json {
        render :json => data
      }
    end
  end
end
