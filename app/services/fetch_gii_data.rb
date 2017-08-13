class FetchGiiData
include ApplicationHelper

  def initialize
    @all_data = []
  end

  def call
    # For every country, get data
    countries = Location.all
    for country in countries
      get_data(country)
    end
    return @all_data
  end

  private

  def get_data(loc)
    # Get all years data is available for
    gii = Dataset.select(:values).find_by data_type: gender_inequality_index_type, location: loc
    sef = Dataset.select(:values).find_by data_type: secondary_education_female_type, location: loc
    sem = Dataset.select(:values).find_by data_type: secondary_education_male_type, location: loc
    lfm = Dataset.select(:values).find_by data_type: labour_force_male_type, location: loc
    lff = Dataset.select(:values).find_by data_type: labour_force_female_type, location: loc
    sop = Dataset.select(:values).find_by data_type: parliament_type, location: loc

    # Check that data exists for values
    if gii == nil
      return
    end

    years = gii.values.collect { |year, val| year }
    for y in years
      data = { year: y.to_i,
        country: loc.country,
        region: loc.region,
        code: loc.code,
        "Gender Inequality Index": get_value(gii, y),
        "Secondary Education Male": get_value(sem, y),
        "Secondary Education Female": get_value(sef, y),
        "Labour Force Male": get_value(lfm, y),
        "Labour Force Female": get_value(lff, y),
        "% of Seats in Parliament Female": get_value(sop, y),
      }

      # Save only data hashes that have no blank values
      if data.values.all? {|x| not x.nil?}
        @all_data.push(data)
      end
    end
  end

  def get_value(data, year)
    if data != nil && data.values != nil
      selected = data.values.select{|x| x[0] == year }.first

      # If data set has value for the selected year, return it
      if selected != nil
        return selected[1]
      end
    end
    return nil
  end
end
