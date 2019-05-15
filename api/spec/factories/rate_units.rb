# frozen_string_literal: true

FactoryBot.define do
  factory :rate_unit do
    billing_unit { 'MyString' }
    effort_unit { 'MyString' }
    factor { '9.99' }
    is_time { false }
    name { 'MyString' }
    archived { false }
  end
end
