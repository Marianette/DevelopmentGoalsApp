class PopulateDatabase
include ApplicationHelper

  attr_reader :hashes, :type

  FIELDS = {
    COUNTRY: 'Country',
    REGION: 'Region',
    CODE: 'Code'
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
      code: contents[FIELDS[:CODE]],
      population: populationArray
    )
  end

  def gender_inequality_index(contents)
    add_to_dataset(contents, gender_inequality_index_type)
  end

  def labour_force_female(contents)
    add_to_dataset(contents, labour_force_female_type)
  end

  def labour_force_male(contents)
    add_to_dataset(contents, labour_force_male_type)
  end

  def national_income_female(contents)
    add_to_dataset(contents, national_income_female_type)
  end

  def national_income_male(contents)
    add_to_dataset(contents, national_income_male_type)
  end

  def secondary_education_female(contents)
    add_to_dataset(contents, secondary_education_female_type)
  end

  def secondary_education_male(contents)
    add_to_dataset(contents, secondary_education_male_type)
  end

  def female_population(contents)
    add_population_to_location(contents, female_population_type)
  end

  def male_population(contents)
    add_population_to_location(contents, male_population_type)
  end

  def add_to_dataset(contents, data_type)
    country = contents[FIELDS[:COUNTRY]]
    loc = Location.find_by_country!(country)
    values = createValueArray(contents)
    Dataset.create!(
      data_type: data_type,
      location: loc,
      values: values
    )
  end

  def add_population_to_location(contents, type)
    country = contents[FIELDS[:COUNTRY]]
    loc = Location.find_by_country!(country)
    values = createPopulationArray(contents)
    if values != nil
      add_population(type, loc, values)
    end
  end

  def add_population(type, loc, values)
    if type == male_population_type
      loc.update!(male_population: values)
    else
      loc.update(female_population: values)
    end
  end

  # HELPERS
  def createPopulationArray(contents)
    population = Array.new
    contents.each do |key, value|
      if (key != FIELDS[:COUNTRY] or key != FIELDS[:REGION]) and not value.blank?
        population.push([key.to_i, value.to_i])
      end
    end
    return population
  end

  def createValueArray(contents)
    values = Array.new
    contents.each do |key, value|
      if key != FIELDS[:COUNTRY] and not value.blank?
        values.push([key.to_i, value.to_f])
      end
    end
    return values
  end
end
