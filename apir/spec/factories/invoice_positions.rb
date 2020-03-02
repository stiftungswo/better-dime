# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_position do
    amount { 9.99 }
    description { "MyInvoicePosition" }
    invoice
    order { 1 }
    price_per_rate { 1.5 }
    rate_unit
    vat { 7.7 }
  end
end
