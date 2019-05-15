# frozen_string_literal: true

FactoryBot.define do
  factory :employee do
    email { 'MyString' }
    admin { false }
    first_name { 'MyString' }
    last_name { 'MyString' }
    can_login { false }
    archived { false }
    holidays_per_year { 1 }
    employee_group
  end
end
