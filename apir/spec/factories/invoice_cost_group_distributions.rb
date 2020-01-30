# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_costgroup_distribution do
    costgroup
    invoice
    weight { 100 }
  end
end
