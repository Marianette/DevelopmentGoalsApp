class Dataset < ActiveRecord::Base
  belongs_to :location
  validates_presence_of :data_type, :location, :values
end
