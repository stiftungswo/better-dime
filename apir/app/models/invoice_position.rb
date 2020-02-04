# frozen_string_literal: true

class InvoicePosition < ApplicationRecord
  include SoftDeletable
  belongs_to :invoice
  belongs_to :rate_unit
  belongs_to :project_position, optional: true
  belongs_to :position_group, optional: true

  validates :amount, :description, :price_per_rate, :vat, :invoice, :rate_unit, presence: true
  validates :amount, numericality: { greater_than_or_equal_to: 0 }
  validates :vat, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 1 }
  validates :order, numericality: { greater_than_or_equal_to: 0 }, if: -> { order.present? }
  validates :price_per_rate, numericality: { only_integer: true }

  def calculated_total
    price_per_rate * amount
  end

  delegate :archived, to: :rate_unit, prefix: true
end
