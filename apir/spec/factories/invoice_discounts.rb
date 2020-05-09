# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_discount do
    invoice
    name { "My InvoiceDiscount" }
    percentage { false }
    value { 150.0 }

    trait :with_percentage do
      percentage { true }
      value { 0.0512 }
    end
  end
end
