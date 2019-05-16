# frozen_string_literal: true

FactoryBot.define do
  factory :offer do
    association :accountant, factory: :employee
    association :customer, factory: :person
    address
    description { 'My offers description' }
    fixed_price { nil }
    name { 'MyOffer' }
    rate_group
    short_description { 'My offers short description' }
    status { 1 }
    fixed_price_vat { nil }

    trait :with_fixed_price do
      fixed_price { 12000 }
      fixed_price_vat { 7.7 }
    end

    trait :with_company_customer do
      association :customer, factory: :company
    end
  end
end
