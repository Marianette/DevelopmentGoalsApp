module ApplicationHelper
  # Helpers to return type names and ensure consistency across all uses.
  def gender_inequality_index_type
    return "Gender Inequality Index"
  end

  def labour_force_female_type
    return "Labour Force Female"
  end

  def labour_force_male_type
    return "Labour Force Male"
  end

  def national_income_female_type
    return "National Income Female"
  end

  def national_income_male_type
    return "National Income Male"
  end

  def secondary_education_female_type
    return "Secondary Education Female"
  end

  def secondary_education_male_type
    return "Secondary Education Male"
  end

  def get_all_data_types
    return [[national_income_male_type, 'NIM'],
                  [national_income_male_type, 'NIF'],
                  [gender_inequality_index_type, 'GII'],
                  [labour_force_male_type, 'LFM'],
                  [labour_force_female_type, 'LFF'],
                  [secondary_education_male_type, 'SEM'],
                  [secondary_education_female_type, 'SEF']].sort_by{ |e| e[0] }
  end

  def get_population_types
    return [['Total Population', 'TP'],
                   ['Male Population', 'MP'],
                   ['Female Population', 'FP']]
  end

  def create_reverse_hash(data)
    Hash[data.collect { |d| [d[1], d[0]]}]
  end

  def get_label(type)
    case type
    when national_income_male_type
      return 'Gross National Income Per Capita ($) - Male'
    when national_income_female_type
      return 'Gross National Income Per Capita ($) - Female'
    when secondary_education_male_type
      return '% of Male Population (25+) with Secondary Education'
    when secondary_education_female_type
      return '% of Female Population (25+) with Secondary Education'
    when labour_force_male_type
      return '% of Male Population (15+) in the Labour Force'
    when labour_force_female_type
      return '% of Female Population (15+) in the Labour Force'
    else
      return 'Gender Inequality Index'
    end
  end
end
