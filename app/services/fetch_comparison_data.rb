class FetchComparisonData

  def initialize(type_x, type_y, type_pop)
    @x = type_x
    @y = type_y
    @pop = type_pop
  end

  def call
    countries = Location.all
    countries.collect { |c| get_data(c) }.reject { |d| d[:x] == nil or d[:y] == nil}
  end

  private

  def get_data(d)
    # Get values for x and y data sets, and ensure that years are the same.
    x = get_values(@x, d)
    y = get_values(@y, d)
    population = d.population

    # Reject years that aren't in both data sets
    x_years = get_years(x)
    y_years = get_years(y)
    if(x_years != nil and y_years != nil)
      common_years = x_years & y_years
      x = x.reject{|d| (not common_years.include? d[0]) }
      y = y.reject{|d| not common_years.include? d[0] }
      population = population.reject{|d| not common_years.include? d[0] }
    else
      x = nil
      y = nil
    end

    return {
      country: d.country,
      region: d.region,
      code: d.code,
      x: x,
      y: y,
      population: population
    }
  end

  def get_years(d)
    if d != nil
      d.collect { |elem| elem[0].to_i }
    end
  end

  def get_values(type, loc)
    entry = Dataset.find_by data_type: type, location: loc
    if entry != nil
      return entry.values
    end
    return nil
  end
end
