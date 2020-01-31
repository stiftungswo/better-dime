# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :v2, defaults: { format: :json } do
    resources :employees

    resources :offers do
      post 'duplicate', on: :member
    end

    get 'projects', to: 'projects#index'
    get 'projects/:id', to: 'projects#show', constraints: { id: /[0-9]+/ }
    get 'projects/potential_invoices', action: :potential_invoices, controller: 'projects'
    put 'projects/:id', to: 'projects#update', constraints: { id: /[0-9]+/ }
    post 'projects/', to: 'projects#create'
    post 'projects/:id/duplicate', to: 'projects#duplicate', constraints: { id: /[0-9]+/ }
    delete 'projects/:id', to: 'projects#destroy', constraints: { id: /[0-9]+/ }

    resources :invoices do
      post 'duplicate', on: :member
    end

  end
  scope :v2 do
    devise_for :employees, defaults: { format: :json }
    devise_for :offers, defaults: { format: :json }
    devise_for :projects, defaults: { format: :json }
  end
end
