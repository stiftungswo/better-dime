# frozen_string_literal: true

FactoryBot.define do
  factory :work_period do
    employee
    beginning { '2019-05-14' }
    ending { '2019-06-14' }
    pensum { 100 }
    vacation_takeover { 4788.0 }
    yearly_vacation_budget { 10_080 }
  end
end
