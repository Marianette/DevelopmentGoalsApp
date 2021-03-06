Rails.application.routes.draw do
  # Main page routes (not visualisations)
  get 'home/index' => 'home#index'
  get 'home/about' => 'home#about'  # sources page

  # Visualisation routes
  get 'explore/education_and_employment' => 'explore#education_and_employment'
  get 'explore/income' => 'explore#income'
  get 'explore/gender_inequality_index' => 'explore#gender_inequality_index'
  get 'explore/compare_indicators' => 'explore#compare_indicators'

  # Data end points for different graphs
  get 'explore/education_and_employment_data' => 'explore#education_and_employment_data', :defaults => { :format => 'json' }
  get 'explore/income_data' => 'explore#income_data', :defaults => { :format => 'json' }
  get 'explore/compare_indicators_data' => 'explore#compare_indicators_data', :defaults => { :format => 'json' }
  get 'explore/gii_data' => 'explore#gii_data', :defaults => { :format => 'json' }

  # Home page
  root 'home#index'
end
