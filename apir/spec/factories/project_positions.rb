# frozen_string_literal: true

FactoryBot.define do
  factory :project_position do
    description { 'MyDescription' }
    price_per_rate { 9200 }
    vat { 0.077 }
    order { 1 }
    rate_unit
    service
  end
end
