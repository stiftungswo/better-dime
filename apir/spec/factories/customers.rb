# frozen_string_literal: true

FactoryBot.define do
  factory :person do
    type { "Person" }
    comment { '9ü|_ 4 3\/3.-' }
    department { "MyDepartment" }
    department_in_address { false }
    company { nil }
    email { "mail@example.com" }
    first_name { "Philipp" }
    last_name { "Saurer" }
    hidden { false }
    accountant { nil }
    salutation { "LGBTQQIP2SAA+" }
    rate_group
    newsletter { false }
    biodiversity_course { false }
  end

  factory :company do
    type { "Company" }
    comment { "test comment" }
    hidden { false }
    name { "Test GmbH" }
    rate_group
    accountant { nil }
  end
end
