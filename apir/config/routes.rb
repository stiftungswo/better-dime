# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :v2, defaults: { format: :json } do
    resources :employees do
      post 'duplicate', on: :member
      post 'archive', on: :member
      put 'archive', on: :member
    end

    resources :holidays, only: %w(index create update destroy) do
      post 'duplicate', on: :member
    end

    resources :offers do
      post 'duplicate', on: :member
    end

    resources :projects, constraints: { id: /[0-9]+/ } do
      post 'duplicate', on: :member
      post 'create_invoice', on: :member
      get 'potential_invoices', on: :collection
    end

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
