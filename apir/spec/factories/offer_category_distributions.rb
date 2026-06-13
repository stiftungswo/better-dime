# frozen_string_literal: true

FactoryBot.define do
  factory :offer_category_distribution do
    project_category
    offer
    weight { 100 }
  end
end
