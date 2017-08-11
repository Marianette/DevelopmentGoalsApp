class FetchComparisonData
include ApplicationHelper

  def initialize(type_x, type_y, type_z)
    @x = type_x
    @y = type_y
    @z = type_z
  end

  def call
    countries = Location.all
    countries.collect { |c| get_data(c) }.reject { |d| d[:x].blank? or d[:y].blank? or d[:z].blank?}
  end

  private

  def get_data(d)
    # Get values for x, y and z data sets, and ensure that years are the same.
    x = get_values(@x, d)
    y = get_values(@y, d)
    z = get_values(@z, d)
    # Reject years that aren't in all data sets
    x_years = get_years(x)
    y_years = get_years(y)
    z_years = get_years(z)
    if(x_years != nil and y_years != nil and z_years != nil)
      common_years = x_years & y_years & z_years
      x = x.reject{|d| not common_years.include? d[0] }
      y = y.reject{|d| not common_years.include? d[0] }
      z = z.reject{|d| not common_years.include? d[0] }
    end

    return {
      country: d.country,
      region: d.region,
      code: d.code,
      x: x,
      y: y,
      z: z
    }
  end

  def get_years(d)
    if d != nil
      d.collect { |elem| elem[0].to_i }
    end
  end

  def get_values(type, loc)
    if type == male_population_type
      return loc.male_population
    elsif type == female_population_type
      return loc.female_population
    elsif type == total_population_type
      return loc.population
    else
      entry = Dataset.find_by data_type: type, location: loc
      if entry != nil
        return entry.values
      end
    end
    return nil
  end
  #
  # def get_datavalues(type, loc, entry)
  #   if type == male_population_type
  #     return loc.male_population
  #   elsif type == female_population_type
  #     return loc.female_population
  #   elsif type == total_population_type
  #     return loc.population
  #   else
  #     return entry.values
  #   end
  # end
end
