# frozen_string_literal: true

FactoryBot.define do
  factory :invoice do
    association :accountant, factory: :employee
    association :customer, factory: :person
    address
    description { "MyDescription" }
    ending { "2019-05-14" }
    beginning { "2019-05-13" }
    fixed_price { nil }
    project
    name { "MyName" }
    fixed_price_vat { nil }

    trait :with_fixed_price do
      fixed_price { 12000 }
      fixed_price_vat { 0.077 }
    end

    trait :with_company_customer do
      association :customer, factory: :company
    end
  end
end
