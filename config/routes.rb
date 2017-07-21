Rails.application.routes.draw do
  get 'home/index' => 'home#index'
  get 'home/about' => 'home#about'

  get 'explore/education_and_employement' => 'explore#education_and_employement'
  get 'explore/income' => 'explore#income'
  get 'explore/gender_inequality_index' => 'explore#gender_inequality_index'

  root 'home#index'
end
