# frozen_string_literal: true

FactoryBot.define do
  factory :service do
    name { 'MyString' }
    description { 'MyString' }
    vat { '9.99' }
    archived { false }
    order { 1 }
  end
end
