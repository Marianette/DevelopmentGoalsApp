Rails.application.routes.draw do
  get 'home/index' => 'home#index'

  # Data end points for different graphs
  get 'home/basic' => 'home#basic', :defaults => { :format => 'json' }
  get 'home/filters' => 'home#filters', :defaults => { :format => 'json' }
  get 'home/interactive' => 'home#interactive', :defaults => { :format => 'json' }

  root 'home#index'
end
