# frozen_string_literal: true

class Offer < ApplicationRecord
  belongs_to :accountant, class_name: 'Employee', foreign_key: 'accountant_id', inverse_of: :offers
  belongs_to :customer
  belongs_to :address
  belongs_to :rate_group

  has_many :offer_discounts, dependent: :destroy
  has_many :offer_positions, dependent: :destroy
  has_one :project, dependent: :restrict_with_exception
end
