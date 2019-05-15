# frozen_string_literal: true

FactoryBot.define do
  factory :invoice do
    accountant { nil }
    customer { nil }
    address { nil }
    description { 'MyText' }
    ending { '2019-05-14' }
    beginning { '2019-05-14' }
    fixed_price { 1 }
    project { nil }
    name { 'MyString' }
    fixed_price_vat { '9.99' }
  end
end
