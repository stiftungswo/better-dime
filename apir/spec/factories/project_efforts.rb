# frozen_string_literal: true

FactoryBot.define do
  factory :project_effort do
    date { "2019-05-14" }
    value { 3.141593 }
    project_position
    employee
  end
end
