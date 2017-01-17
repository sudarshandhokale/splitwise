Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'api/v1/auth'
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      resources :events, only: [:index, :create, :update]
      resources :users, only: [:index]
    end
  end
  mount ActionCable.server => '/cable'
  get 'application/index' => 'application#index'
  get '*path' => 'application#index'
  root 'application#index'
end
