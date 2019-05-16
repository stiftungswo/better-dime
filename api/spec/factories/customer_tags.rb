# frozen_string_literal: true

FactoryBot.define do
  factory :customer_tag do
    archived { false }
    name { 'MyString' }
  end
end
