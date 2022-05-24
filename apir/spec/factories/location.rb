# frozen_string_literal: true

FactoryBot.define do
  factory :location do
    name { "MyName" }
    url { "MyUrl" }
    order { 1234 }
    archived { false }
  end
end
