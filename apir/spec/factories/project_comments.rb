# frozen_string_literal: true

FactoryBot.define do
  factory :project_comment do
    comment { "MyComment" }
    date { "2019-05-14" }
  end
end
