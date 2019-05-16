# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_cost_group_distribution do
    cost_group
    invoice
    weight { 100 }
  end
end
