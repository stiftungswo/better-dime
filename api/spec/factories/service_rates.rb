# frozen_string_literal: true

FactoryBot.define do
  factory :service_rate do
    rate_group { nil }
    service { nil }
    rate_unit { nil }
    value { 1 }
  end
end
