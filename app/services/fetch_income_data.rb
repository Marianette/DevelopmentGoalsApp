class FetchIncomeData

  def initialize(female, male)
    @female_type = female
    @male_type = male
  end

  def call
    countries = Location.all
    Hash[countries.collect { |c| [c.country, get_data(c)] }]
  end

  private

  def get_data(d)
    # Create hash objects that store male and female data.
    male_data = get_years(Dataset.find_by data_type: @male_type, location: d)
    female_data = get_years(Dataset.find_by data_type: @female_type, location: d)
    return {
      region: d.region,
      male: male_data,
      female: female_data
    }
  end

  def get_years(d)
    if d != nil
      Hash[d.values.collect { |(year,val)| [year.to_i, val.to_i] } ]
    end
  end
end
