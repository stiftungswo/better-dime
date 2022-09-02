# frozen_string_literal: true

class Invoice < ApplicationRecord
  include SoftDeletable

  belongs_to :accountant, class_name: "Employee", inverse_of: :invoices
  belongs_to :customer
  belongs_to :address
  belongs_to :project
  belongs_to :location, optional: true

  has_many :invoice_discounts, dependent: :destroy
  has_many :invoice_positions, dependent: :destroy
  has_many :invoice_costgroup_distributions, dependent: :destroy

  accepts_nested_attributes_for :invoice_positions, :invoice_discounts, allow_destroy: true
  accepts_nested_attributes_for :invoice_costgroup_distributions, allow_destroy: true

  validates :accountant, :address, :description, :beginning, :ending, :name, presence: true
  validates :beginning, :ending, timeliness: { type: :date }
  validates :ending, timeliness: { on_or_after: :beginning }
  validates :fixed_price, numericality: { only_integer: true }, if: -> { fixed_price.present? }
  validates :fixed_price_vat, numericality: { greater_than_or_equal_to: 0 }, if: -> { fixed_price_vat.present? }

  def breakdown
    @breakdown ||= CostBreakdown.new(invoice_positions, invoice_discounts, position_groupings, fixed_price, fixed_price_vat || 0.077).calculate
  end

  def position_groupings
    invoice_positions.uniq { |p| p.position_group&.id }.map(&:position_group).select { |g| g }
  end

  def sibling_invoice_ids
    project&.invoice_ids&.select { |i| i != id } || []
  end
end
