Rails.application.routes.draw do
  get 'home/index' => 'home#index'
  get 'home/about' => 'home#about'

  get 'explore/education_and_employment' => 'explore#education_and_employment'
  get 'explore/income' => 'explore#income'
  get 'explore/gender_inequality_index' => 'explore#gender_inequality_index'

  # Data endpoints for the different visualisations
  get 'explore/income_data' => 'explore#income_data', :defaults => { :format => 'json' }

  root 'home#index'
end
