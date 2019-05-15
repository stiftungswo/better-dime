# frozen_string_literal: true

FactoryBot.define do
  factory :work_period do
    employee { nil }
    beginning { '2019-05-14' }
    ending { '2019-05-14' }
    pensum { 1 }
    vacation_takeover { '9.99' }
    yearly_vacation_budget { 1 }
  end
end
