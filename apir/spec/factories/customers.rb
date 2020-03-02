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
    comment { "G\u00FCl GmbH" }
    hidden { false }
    name { "G\u00FCl GmbH" }
    rate_group
  end
end
