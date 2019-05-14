FactoryBot.define do
  factory :project_position do
    description { "MyString" }
    price_per_rate { 1 }
    rate_unit { nil }
    service { nil }
    vat { "9.99" }
    order { 1 }
  end
end
