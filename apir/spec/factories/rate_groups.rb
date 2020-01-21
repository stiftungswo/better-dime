# frozen_string_literal: true

FactoryBot.define do
  factory :rate_group do
    sequence(:name) { |i| "My rate group #{i}" }
    description { 'My rate group description' }
  end
end
