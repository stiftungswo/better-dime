# frozen_string_literal: true

class InvoiceCostgroupDistribution < ApplicationRecord
  include SoftDeletable

  belongs_to :costgroup, foreign_key: :costgroup_number
  belongs_to :invoice

  validates :costgroup, :invoice, :weight, presence: true
  validates :weight, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def weight_percent
    weight_sum = invoice.invoice_costgroup_distributions.inject(0.0) do |sum, cost_dist|
      sum + cost_dist.weight
    end

    weight / weight_sum * 100.0
  end
end
