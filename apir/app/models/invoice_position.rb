# frozen_string_literal: true

class InvoicePosition < ApplicationRecord
  belongs_to :invoice
  belongs_to :rate_unit
  belongs_to :project_position, optional: true
  belongs_to :position_group, optional: true

  validates :amount, :description, :price_per_rate, :vat, :invoice, :rate_unit, presence: true
  validates :amount, numericality: { greater_than_or_equal_to: 0 }
  validates :order, numericality: { greater_than_or_equal_to: 0 }, if: -> { order.present? }
  validates :price_per_rate, numericality: { only_integer: true }

  def calculated_total
    price_per_rate * amount
  end

  def rate_unit_archived
    rate_unit.archived
  end
end
