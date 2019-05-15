# frozen_string_literal: true

FactoryBot.define do
  factory :project_effort do
    date { '2019-05-14' }
    employee { nil }
    project_position { nil }
    value { '9.99' }
  end
end
