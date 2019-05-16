# frozen_string_literal: true

FactoryBot.define do
  factory :project_cost_group_distribution do
    weight { 100 }
    cost_group
  end
end
