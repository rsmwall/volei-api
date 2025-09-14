Rails.application.routes.draw do
  get "ratings/create"
  get "match_requests/create"
  get "match_requests/accept"
  get "match_requests/reject"
  get "players/create"
  get "players/show"
  get "players/update"
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  resources :players, only: [ :create, :show, :update ] do
    collection do
      get :ranking
    end
  end
  resources :matches, only: [ :create, :index ]
  resources :match_requests, only: [ :create ] do
    member do
      patch :accept
      patch :reject
      patch :pay
      patch :withdraw
    end
  end
  resources :ratings, only: [ :create ]
end
