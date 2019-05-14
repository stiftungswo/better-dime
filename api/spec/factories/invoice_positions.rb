FactoryBot.define do
  factory :invoice_position do
    amount { "9.99" }
    description { "MyString" }
    invoice { nil }
    order { 1 }
    price_per_rate { 1 }
    rate_unit { nil }
    vat { "9.99" }
  end
end
