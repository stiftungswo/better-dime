# frozen_string_literal: true

FactoryBot.define do
  factory :employee do
    sequence(:email) { |i| "my#{i}@mail.com" }
    is_admin { false }
    first_name { 'Peter' }
    last_name { 'Pan' }
    can_login { true }
    archived { false }
    holidays_per_year { 12 }
    first_vacation_takeover { 0 }
    employee_group

    trait :admin do
      is_admin { true }
    end
  end
end
