FactoryBot.define do
  factory :offer do
    accountant { nil }
    customer { nil }
    address { nil }
    description { "MyText" }
    fixed_price { 1 }
    name { "MyString" }
    rate_group { nil }
    short_description { "MyText" }
    status { 1 }
    fixed_price_vat { "9.99" }
  end
end
