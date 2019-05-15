# frozen_string_literal: true

FactoryBot.define do
  factory :offer_position do
    amount { '9.99' }
    description { 'MyString' }
    offer { nil }
    order { 1 }
    price_per_rate { 1 }
    rate_unit { nil }
    service { nil }
    vat { '9.99' }
  end
end
