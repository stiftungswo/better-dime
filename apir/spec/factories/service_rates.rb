# frozen_string_literal: true

FactoryBot.define do
  factory :service_rate do
    value { 1 }
    rate_group
    service
    rate_unit
  end
end
