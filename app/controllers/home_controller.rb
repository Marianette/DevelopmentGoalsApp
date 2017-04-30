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
  		{date: "12/02/2017", books: 20, movies: 10, chocolate: 200},
  		{date: "12/12/2016", books: 12, movies: 9, chocolate: 150},
  		{date: "15/12/2016", books: 11, movies: 3, chocolate: 234},
  		{date: "31/01/2017", books: 24, movies: 6, chocolate: 232},
  		{date: "04/02/2017", books: 21, movies: 9, chocolate: 123},
  		{date: "13/02/2017", books: 19, movies: 2, chocolate: 133},
  		{date: "19/02/2017", books: 27, movies: 4, chocolate: 113},
  		{date: "01/01/2017", books: 21, movies: 9, chocolate: 123},
  		{date: "01/12/2016", books: 31, movies: 7, chocolate: 213},
  		{date: "06/11/2016", books: 13, movies: 7, chocolate: 125},
  		{date: "14/11/2016", books: 14, movies: 4, chocolate: 124},
  		{date: "21/11/2016", books: 54, movies: 4, chocolate: 234},
  		{date: "25/12/2016", books: 34, movies: 9, chocolate: 154},
  		{date: "08/10/2016", books: 21, movies: 2, chocolate: 196},
  		{date: "18/10/2016", books: 19, movies: 2, chocolate: 180}
  		]
    respond_to do |format|
      format.json {
        render :json => data
      }
    end
  end

  def interactive
    data = []
    respond_to do |format|
      format.json {
        render :json => data
      }
    end
  end
end
