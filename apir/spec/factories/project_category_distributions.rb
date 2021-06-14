# frozen_string_literal: true

FactoryBot.define do
  factory :project_category_distribution do
    weight { 100 }
    project_category
  end
end
