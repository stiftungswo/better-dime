# frozen_string_literal: true

FactoryBot.define do
  factory :offer_position do
    amount { 99 }
    description { "MyString" }
    order { 1 }
    price_per_rate { 1 }
    rate_unit
    service
    offer
    vat { 0.99 }
  end
end
