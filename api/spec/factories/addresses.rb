# frozen_string_literal: true

FactoryBot.define do
  factory :address do
    city { 'Winterthur' }
    country { 'Schweiz' }
    description { nil }
    zip { 8400 }
    street { 'Bahnhofstrasse 12' }
    supplement { 'Postfach 1230' }
    customer
  end
end
