class ExploreController < ApplicationController
  def education_and_employment
    # Outline available data sets
    @datasets = [['Secondary Education','education'],
                  ['Labour Force Rates', 'employment'],
                  ['Education vs. Employment', 'comparison']]

    @title = 'Education and Employment'
  end

  def income
    # Find all countries that there is gross national income data for
    country_data = Dataset.where(:data_type => [national_income_male_type, national_income_female_type])
                  .joins(:location)
                  .select(:country, :code, :region).uniq

    # Create arrays for selectors
    @countries = country_data.collect{ |d| [d.country, d.code] } # sort alphabeticallly
    @regions = country_data.collect { |d| [d.region, d.region] }.uniq
    @regions.push(["World", "World"])

    # Get years for data
    first_record = Dataset.where(data_type: national_income_male_type).first
    @years = first_record.values.collect { |d| d[0].to_i }

    # Create array to store possible data sets
    @datasets = [['Estimated Gross National Income (GNI)', 'male'],
                  ['Difference between Male GNI and Female GNI', 'diff']]

    @title = 'Gross National Income'
  end

  def gender_inequality_index
    @title = 'Gender Inequality Index'
  end

  def compare_indicators
    @title = 'Compare Indicators'
  end

  # JSON endpoints
  def education_and_employment_data
    data = FetchEducationAndEmploymentData.new(secondary_education_female_type,
                                                secondary_education_male_type,
                                                labour_force_female_type,
                                                labour_force_male_type).call

    world = JSON.parse(File.read('db/data/world-topo.json'))

    respond_to do |format|
      format.json { render :json => {
          :data => data,
          :world => world
        }
      }
    end
  end

  def income_data
    data = FetchIncomeData.new(national_income_female_type, national_income_male_type).call
    respond_to do |format|
      format.json { render :json => data }
    end
  end
end
