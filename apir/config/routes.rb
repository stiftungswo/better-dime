# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :v2, defaults: { format: :json } do
    resources :employees do
      post "duplicate", on: :member
      post "archive", on: :member
      put "archive", on: :member
      get "effort_report", on: :member, defaults: { format: "pdf" }
    end

    resources :project_efforts, constraints: { id: /[0-9]+/ } do
      put "move", on: :collection
    end

    resources :project_comments, constraints: { id: /[0-9]+/ } do
      put "move", on: :collection
    end

    resources :employee_groups
    resources :position_groups, only: :create
    resources :project_comment_presets
    resources :rate_units
    resources :rate_groups, only: :index
    resources :costgroups, only: :index

    get "reports/project_report(/:id)", to: "reports#project_report", defaults: { format: "pdf" }
    get "reports/employees_report", to: "reports#employees_project_report", defaults: { format: "pdf" }
    get "reports/service_hours", to: "service_hour_reports#index"
    get "reports/service_hours/project", to: "service_hour_reports#project"
    get "reports/service_hours/project_category", to: "service_hour_reports#project_category"
    get "reports/service_costs", to: "service_cost_reports#index"
    get "reports/service_costs/project", to: "service_cost_reports#project"
    get "reports/costgroup", to: "cost_group_reports#index"
    get "reports/revenue", to: "revenue_reports#index"
    get "reports/daily", to: "daily_reports#index"
    get "reports(/:id)", to: "reports#show", defaults: { format: "pdf" }

    get "global_settings", to: "global_settings#index"
    put "global_settings", to: "global_settings#update"

    resources :holidays, only: %w[index create update destroy] do
      post "duplicate", on: :member
    end

    resources :offers do
      post "duplicate", on: :member
      post "create_project", on: :member
      get "print", on: :member, defaults: { format: "pdf" }
    end

    resources :projects, constraints: { id: /\d+/ } do
      post "duplicate", on: :member
      post "create_invoice", on: :member
      get "potential_invoices", on: :collection
      get "effort_report", on: :member, defaults: { format: "pdf" }
    end

    resources :invoices do
      post "duplicate", on: :member
      get "print", on: :member, defaults: { format: "pdf" }
      get "print_qr_bill", on: :member, defaults: { format: "pdf" }
      get "effort_report", on: :member, defaults: { format: "pdf" }
      put "update_timespan", on: :member
    end

    resources :services do
      post "duplicate", on: :member
    end

    resources :project_categories do
      put "archive", on: :member
    end

    resources :customers do
      post "duplicate", on: :member
      post "archive", on: :member
      put "archive", on: :member
      get "export", to: "customers#index", on: :collection
      get "import/template", to: "customers_import#template", on: :collection
      post "import/verify", to: "customers_import#verify", on: :collection
      post "import", to: "customers_import#create", on: :collection
    end

    resources :people do
      post "duplicate", on: :member
      put "hide", on: :member
    end

    resources :companies do
      post "duplicate", on: :member
      put "hide", on: :member
    end

    resources :customer_tags do
      put "archive", on: :member
    end

    resources :locations do
      put "archive", on: :member
    end
  end

  scope :v2 do
    devise_for :employees, defaults: { format: :json }
  end

  mount HealthMonitor::Engine, at: "/"
  get "/health", to: redirect("/check")
  get "/", to: redirect("/health")
end
