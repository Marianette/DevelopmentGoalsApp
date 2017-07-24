class ExploreController < ApplicationController
  def education_and_employment
    @data = FetchEducationAndEmploymentData.new(secondary_education_female_type,
                                                secondary_education_male_type,
                                                labour_force_female_type,
                                                labour_force_male_type).call
  end

  def income
    @data_url = explore_income_data_path
  end

  def gender_inequality_index
  end

  # JSON responses
  def income_data
    data = FetchIncomeData.new(national_income_female_type, national_income_male_type).call
    respond_to do |format|
      format.json {
        render :json => data
      }
    end
  end
end
