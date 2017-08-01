class FetchIncomeData

  def initialize(female, male)
    @female_type = female
    @male_type = male
  end

  def call
    countries = Location.all
    countries.collect { |c| get_data(c) }.reject { |d| d[:male].blank? or d[:female].blank?}
  end

  private

  def get_data(d)
    # Create hash objects that store male and female data.
    male_data = get_years(Dataset.find_by data_type: @male_type, location: d)
    female_data = get_years(Dataset.find_by data_type: @female_type, location: d)
    percentage_gap = get_diff(male_data, female_data)
    return {
      country: d.country,
      region: d.region,
      code: d.code,
      male: male_data,
      female: female_data,
      diff: percentage_gap
    }
  end

  def get_years(d)
    if d != nil
      Hash[d.values.collect { |(year,val)| [year.to_i, val.to_i] } ]
    end
  end

  def get_diff(male, female)
    if male != nil and female != nil
      diffs = Hash[male.collect { |(year,val)| get_diff_data(val, female[year], year) } ]
      diffs = diffs.reject{ |x| x == nil }
    end
  end

  def get_diff_data(male_val, female_val, year)
    if(male_val == nil or female_val == nil)
      return [nil , nil]
    end
    return [year.to_i, (((male_val - female_val)/male_val.to_f) * 100).round(1)]
  end
end
