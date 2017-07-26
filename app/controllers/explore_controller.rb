class ExploreController < ApplicationController
  def education_and_employment
    @data = FetchEducationAndEmploymentData.new(secondary_education_female_type,
                                                secondary_education_male_type,
                                                labour_force_female_type,
                                                labour_force_male_type).call
    @title = 'Education and Employment'
  end

  def income
    @data = FetchIncomeData.new(national_income_female_type, national_income_male_type).call
    @countries = @data.collect{ |d| [d[:country], d[:code]] }

    region = Dataset.where(:data_type => national_income_male_type).joins(:location).select(:region).uniq
    @regions = region.collect { |r| [r.region, r.region] }
    @regions.push(["World", "World"])

    # Get years for data
    @years = @data[0][:male].collect { |(year, val)| year.to_i }

    @title = 'Gross National Income'
  end

  def gender_inequality_index
    @title = 'Gender Inequality Index'
  end

  def compare_indicators
    @title = 'Compare Indicators'
  end
end
