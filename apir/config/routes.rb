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
    resources :rate_groups, only: :index
    resources :costgroups, only: :index

    get "global_settings", to: "global_settings#index"
    put "global_settings", to: "global_settings#update"

    resources :holidays, only: %w[index create update destroy] do
      post "duplicate", on: :member
    end

    resources :offers do
      post "duplicate", on: :member
      post "create_project", on: :member
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
      # post "duplicate", on: :member
      # post "archive", on: :member
      # put "archive", on: :member
      get "export", to: "customers#index", on: :collection
      get "import/template", to: "customers_import#template", on: :collection
      post "import/verify", to: "customers_import#verify", on: :collection
      post "import", to: "customers_import#create", on: :collection
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
  end

  mount HealthMonitor::Engine, at: '/'
  get '/health', to: redirect('/check')
  get '/', to: redirect('/health')
end
