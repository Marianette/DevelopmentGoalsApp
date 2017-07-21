class FetchEducationAndEmploymentData

  def initialize(edu_f, edu_m, employ_f, employ_m)
    @edu_female_type = edu_f
    @edu_male_type = edu_m
    @employ_female_type = employ_f
    @employ_male_type = employ_m
  end

  def call
    countries = Location.all
    Hash[countries.collect { |c| [c.country, get_data(c)] }]
  end

  private

  def get_data(d)
    male_edu = get_years(Dataset.find_by data_type: @edu_male_type, location: d)
    female_edu = get_years(Dataset.find_by data_type: @edu_female_type, location: d)
    diff_edu = calculate_difference(male_edu, female_edu)

    male_employ = get_years(Dataset.find_by data_type: @employ_male_type, location: d)
    female_employ = get_years(Dataset.find_by data_type: @employ_female_type, location: d)
    diff_employ = calculate_difference(male_employ, female_employ)

    return {
      region: d.region,
      education: {
        male: male_edu,
        female: female_edu,
        diff: diff_edu
      },
      employment: {
        male: male_employ,
        female: female_employ,
        diff: diff_employ
      }
    }
  end

  def get_years(d)
    if d != nil
      Hash[d.values.collect { |(year,val)| [year.to_i, val.round(2)] } ]
    end
  end

  def calculate_difference(male, female)
    if male != nil and female != nil
      Hash[male.collect { |(year, val)| [year.to_i, (male[year] - female[year]).round(2)] } ]
    end
  end
end
