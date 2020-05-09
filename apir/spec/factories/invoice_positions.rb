# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_position do
    amount { 9.99 }
    description { "MyInvoicePosition" }
    position_group
    invoice
    order { 1 }
    price_per_rate { 15 }
    rate_unit
    vat { 0.077 }
  end
end
