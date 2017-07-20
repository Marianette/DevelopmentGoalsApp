class Dataset < ActiveRecord::Base
  belongs_to :location
  validates_presence_of :type, :location, :values
end
