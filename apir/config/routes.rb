# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :v2, defaults: { format: :json } do
    resources :employees do
      post "duplicate", on: :member
      post "archive", on: :member
      put "archive", on: :member
    end

    resources :project_efforts, constraints: { id: /[0-9]+/ } do
      put 'move', on: :collection
    end

    resources :employee_groups
    resources :position_groups, only: :create
    resources :project_comment_presets
    resources :project_comments
    resources :rate_units

    get "global_settings", to: "global_settings#index"
    put "global_settings", to: "global_settings#update"

    resources :holidays, only: %w[index create update destroy] do
      post "duplicate", on: :member
    end

    resources :offers do
      post "duplicate", on: :member
    end

    resources :services do
      post "duplicate", on: :member
    end

    resources :projects, constraints: { id: /\d+/ } do
      post "duplicate", on: :member
      post "create_invoice", on: :member
      get "potential_invoices", on: :collection
    end

    resources :project_categories do
      put "archive", on: :member
    end

    resources :customers do
      post "duplicate", on: :member
      post "archive", on: :member
      put "archive", on: :member
    end

    resources :people do
      post "duplicate", on: :member
      post "archive", on: :member
      put "archive", on: :member
    end

    resources :companies do
      post "duplicate", on: :member
      post "archive", on: :member
      put "archive", on: :member
    end

    resources :customer_tags do
      put "archive", on: :member
    end

    resources :invoices do
      post "duplicate", on: :member
    end
  end
  scope :v2 do
    devise_for :employees, defaults: { format: :json }
    devise_for :offers, defaults: { format: :json }
    devise_for :projects, defaults: { format: :json }
    devise_for :invoices, defaults: { format: :json }
    devise_for :holidays, defaults: { format: :json }
    devise_for :services, defaults: { format: :json }
    devise_for :position_groups, defaults: { format: :json }
    devise_for :project_comment_presets, defaults: { format: :json }
    devise_for :project_comments, defaults: { format: :json }
    devise_for :rate_units, defaults: { format: :json }
    devise_for :project_efforts, defaults: { format: :json }
    devise_for :employee_groups, defaults: { format: :json }
    devise_for :global_settings, defaults: { format: :json }
  end
end
