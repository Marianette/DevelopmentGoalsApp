class Location < ActiveRecord::Base
  CODE_ERROR_MESSAGE = 'must be 3 upper case letters'.freeze

  validates_presence_of :country, :region, :code, :population
  validates_format_of :code, with: /\A[A-Z]{3}\z/, message: CODE_ERROR_MESSAGE
end
