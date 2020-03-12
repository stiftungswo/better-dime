# frozen_string_literal: true

class OfferPosition < ApplicationRecord
  include SoftDeletable
  belongs_to :offer
  belongs_to :position_group, optional: true
  belongs_to :rate_unit
  belongs_to :service

  validates :amount, :order, :price_per_rate, :rate_unit, :service, :vat, presence: true
  validates :amount, :order, numericality: { greater_than_or_equal_to: 0 }

  delegate :archived, to: :rate_unit, prefix: true

  def calculated_total
    price_per_rate * amount
  end

  def estimated_work_hours
    rate_unit.is_time ? amount * rate_unit.factor : 0
  end
end
