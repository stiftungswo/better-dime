# frozen_string_literal: true

FactoryBot.define do
  factory :service do
    name { "My service" }
    description { "A great service" }
    vat { 0.077 }
    archived { false }
    order { 1 }
  end
end
