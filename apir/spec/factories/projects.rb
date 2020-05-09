# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    archived { false }
    chargeable { false }
    deadline { Time.zone.today + 2.weeks }
    description { "my description" }
    fixed_price { nil }
    sequence(:name) { |i| "Project ##{i}" }
    vacation_project { false }
    association :accountant, factory: :employee
    association :customer, factory: :person
    address
    project_category
    offer
    rate_group

    trait :with_fixed_price do
      fixed_price { 12000 }
    end

    trait :with_company_customer do
      association :customer, factory: :company
    end
  end
end
