# frozen_string_literal: true

class Offer < ApplicationRecord
  has_many :offer_discounts, dependent: :restrict_with_exception
  has_many :offer_positions, dependent: :restrict_with_exception

  belongs_to :accountant, class_name: 'Employee', foreign_key: 'accountant_id', inverse_of: :offers
  belongs_to :customer
  belongs_to :address
  belongs_to :rate_group
end
