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
    data = []
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
