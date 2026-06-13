# frozen_string_literal: true

FactoryBot.define do
  factory :offer_costgroup_distribution do
    costgroup
    offer
    weight { 100 }
  end
end
