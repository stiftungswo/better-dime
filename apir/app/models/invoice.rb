# frozen_string_literal: true

class Invoice < ApplicationRecord
  include SoftDeletable

  belongs_to :accountant, class_name: "Employee", foreign_key: "accountant_id", inverse_of: :invoices
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

  delegate :costgroup_distribution, :costgroup_sums, :missing_costgroup_distribution, :costgroup_dist_incomplete?, to: :cost_group_breakdown

  def breakdown
    @breakdown ||= CostBreakdown.new(invoice_positions, invoice_discounts, final_cost_group_distribution, position_groupings, fixed_price, fixed_price_vat || 0.077).calculate
  end

  def final_cost_group_distribution
    @final_cost_group_distribution ||= calculate_final_cost_group_distribution
  end

  def calculate_final_cost_group_distribution
    costgroups_override = invoice_costgroup_distributions.to_h do |icd|
      [icd[:costgroup_number], icd.weight_percent]
    end

    cost_group_breakdown.costgroup_sums.to_h { |cg, weight| [cg, costgroups_override[cg] || weight] }
  end

  def cost_group_breakdown
    @cost_group_breakdown ||= CostGroupBreakdownService.new project, beginning..ending
  end

  def position_groupings
    invoice_positions.uniq { |p| p.position_group&.id }.map(&:position_group).select { |g| g }
  end

  def sibling_invoice_ids
    project&.invoice_ids&.select { |i| i != id } || []
  end
end
