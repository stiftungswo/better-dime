# frozen_string_literal: true

FactoryBot.define do
  factory :address do
    city { "Winterthur" }
    country { "Schweiz" }
    description { nil }
    zip { 8400 }
    street { "Bahnhofstrasse" }
    street_number { "12" }
    supplement { "Postfach 1230" }
    association :customer, factory: :person

    trait :with_company_customer do
      association :customer, factory: :company
    end
  end
end
