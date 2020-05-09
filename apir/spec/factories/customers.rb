# frozen_string_literal: true

FactoryBot.define do
  factory :person do
    type { "Person" }
    comment { '9ü|_ 4 3\/3.-' }
    department { "MyDepartment" }
    company { nil }
    email { "mail@example.com" }
    first_name { "Philipp" }
    last_name { "Saurer" }
    hidden { false }
    salutation { "LGBTQQIP2SAA+" }
    rate_group
  end

  factory :company do
    type { "Company" }
    comment { "test comment" }
    hidden { false }
    name { "Test GmbH" }
    rate_group
  end
end
