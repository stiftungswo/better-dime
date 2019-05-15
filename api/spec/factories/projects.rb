# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    archived { false }
    chargeable { false }
    deadline { Time.zone.today + 2.weeks }
    description { 'my description' }
    fixed_price { 1 }
    sequence(:name) { |i| "Project ##{i}" }
    vacation_project { false }
    accountant
    customer
    address
    project_category
    offer
    rate_group
  end
end
