# frozen_string_literal: true

class OfferPosition < ApplicationRecord
  include SoftDeletable
  belongs_to :offer
  belongs_to :rate_unit
  belongs_to :service

  validates :amount, :order, :price_per_rate, :rate_unit, :service, :vat, presence: true
  validates :amount, :order, numericality: { greater_than_or_equal_to: 0 }
end
