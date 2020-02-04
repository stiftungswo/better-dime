# frozen_string_literal: true

FactoryBot.define do
  factory :phone do
    number { "0433555844" }
    category { :main }
    customer
  end
end
