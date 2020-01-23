# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :v2, defaults: { format: :json } do
    resources :employees
  end
  scope :v2 do
    devise_for :employees, defaults: { format: :json }
  end
end
