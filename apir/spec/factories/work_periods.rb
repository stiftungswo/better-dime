# frozen_string_literal: true

FactoryBot.define do
  factory :work_period do
    beginning { "2019-05-14" }
    ending { "2019-06-14" }
    pensum { 100 }
    yearly_vacation_budget { 10_080 }
    employee
  end
end
