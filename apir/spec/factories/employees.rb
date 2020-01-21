# frozen_string_literal: true

FactoryBot.define do
  factory :employee do
    sequence(:email) { |i| "my#{i}@mail.com" }
    admin { false }
    first_name { 'Peter' }
    last_name { 'Pan' }
    can_login { true }
    archived { false }
    holidays_per_year { 12 }
    employee_group

    trait :admin do
      admin { true }
    end
  end
end
