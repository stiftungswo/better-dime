# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :v2, defaults: { format: :json } do
    resources :employees

    resources :offers do
      member do
        post 'duplicate'
      end
    end

    resources :projects do
      member do
        post 'duplicate'
      end
    end
  end
  scope :v2 do
    devise_for :employees, defaults: { format: :json }
    devise_for :offers, defaults: { format: :json }
    devise_for :projects, defaults: { format: :json }
  end
end
