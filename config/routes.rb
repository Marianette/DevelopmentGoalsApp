Rails.application.routes.draw do
  get 'home/index' => 'home#index'
  get 'explore/secondaryEducation' => 'explore#schoolVis'

  root 'home#index'
end
