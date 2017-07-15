Rails.application.routes.draw do
  get 'home/index' => 'home#index'
  root 'home#index'
end
