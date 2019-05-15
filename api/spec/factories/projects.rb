# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    accountant { nil }
    customer { nil }
    address { nil }
    archived { false }
    project_category { nil }
    chargeable { false }
    deadline { '2019-05-15' }
    description { 'MyText' }
    fixed_price { 1 }
    name { 'MyString' }
    offer { nil }
    rate_group { nil }
    vacation_project { false }
  end
end
