class Offer < ApplicationRecord
  belongs_to :accountant, class_name: 'Employee', foreign_key: 'accountant_id', inverse_of: :offers
  belongs_to :customer
  belongs_to :address
  belongs_to :rate_group
end
