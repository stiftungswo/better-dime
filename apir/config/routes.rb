# frozen_string_literal: true

Rails.application.routes.draw do
  scope :v2 do
    devise_for :employees, defaults: { format: :json }
  end
end
