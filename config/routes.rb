Rails.application.routes.draw do
  get 'home/index' => 'home#index'
  get 'home/about' => 'home#about'

  get 'explore/education_and_employment' => 'explore#education_and_employment'
  get 'explore/income' => 'explore#income'
  get 'explore/gender_inequality_index' => 'explore#gender_inequality_index'
  get 'explore/compare_indicators' => 'explore#compare_indicators'

  root 'home#index'
end
