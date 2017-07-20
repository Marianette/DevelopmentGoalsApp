class PopulateDatabase
  attr_reader :hashes, :type

  FIELDS = {
    COUNTRY: 'Country',
    REGION: 'Region'
  }.freeze

  def initialize(hashes, type)
    @hashes = hashes
    @type = type
  end

  def call
    hashes.each do |hash|
      send(type, hash)
    end
  end

  private

  def location(contents)
    populationArray = createPopulationArray(contents)
    Location.create!(
      country: contents[FIELDS[:COUNTRY]],
      region: contents[FIELDS[:REGION]],
      population: populationArray
    )
  end

  # HELPERS
  def createPopulationArray(contents)
    population = Array.new
    contents.each do |key, value|
      if key != FIELDS[:COUNTRY] || key != FIELDS[:REGION]
        population.push([key.to_i, value.to_i])
      end
    end
    return population
  end
end
