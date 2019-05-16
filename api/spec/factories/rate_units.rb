# frozen_string_literal: true

FactoryBot.define do
  factory :rate_unit do
    billing_unit { 'CHF/d' }
    effort_unit { 'zt' }
    factor { 504 }
    is_time { true }
    name { 'Zivitage' }
    archived { false }
  end
end
