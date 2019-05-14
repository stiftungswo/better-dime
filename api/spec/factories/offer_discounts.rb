FactoryBot.define do
  factory :offer_discount do
    name { "MyString" }
    offer { nil }
    percentage { false }
    value { "9.99" }
  end
end
