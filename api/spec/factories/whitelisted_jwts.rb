# frozen_string_literal: true

FactoryBot.define do
  factory :whitelisted_jwt do
    jti { 'MyString' }
    aud { 'MyString' }
    exp { '2019-05-16 13:39:45' }
    employee { nil }
  end
end
