# frozen_string_literal: true

FactoryBot.define do
  factory :costgroup do
    sequence(:number) { |n| n + 100 }
    name { "MyString" }
  end
end
