class ExploreController < ApplicationController
  def education_and_employment
    @data = FetchEducationAndEmploymentData.new(secondary_education_female_type,
                                                secondary_education_male_type,
                                                labour_force_female_type,
                                                labour_force_male_type).call
  end

  def income
    @data = FetchIncomeData.new(national_income_female_type, national_income_male_type).call
  end

  def gender_inequality_index
  end
end
