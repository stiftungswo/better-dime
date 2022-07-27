# frozen_string_literal: true

FactoryBot.define do
  factory :service_category do
    name { "MyString" }
    french_name { "MyOtherString" }
    number { 93 }
  end
end
