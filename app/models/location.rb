class Location < ActiveRecord::Base
  validates_presence_of :country, :region, :population
end
