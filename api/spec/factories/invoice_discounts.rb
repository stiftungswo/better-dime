# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_discount do
    invoice { nil }
    name { 'MyString' }
    percentage { false }
    value { '9.99' }
  end
end
