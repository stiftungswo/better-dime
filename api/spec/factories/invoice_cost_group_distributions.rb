# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_cost_group_distribution do
    cost_group { nil }
    invoice { nil }
    weight { 1 }
  end
end
