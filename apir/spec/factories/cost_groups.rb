# frozen_string_literal: true

FactoryBot.define do
  factory :costgroup do
    sequence(:number) { |n| 100 + n }
    name { "MyString" }
  end
end
