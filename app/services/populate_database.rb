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

  def gender_inequality_index(contents)
    add_to_dataset(contents, "Gender Inequality Index")
  end

  def add_to_dataset(contents, data_type)
    country = contents[FIELDS[:COUNTRY]]
    loc = Location.find_by_country(country)
    values = createValueArray(contents)
    Dataset.create!(
      data_type: data_type,
      location: loc,
      values: values
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

  def createValueArray(contents)
    values = Array.new
    contents.each do |key, value|
      if key != FIELDS[:COUNTRY]
        values.push([key.to_i, value.to_f])
      end
    end
    return values
  end
end
