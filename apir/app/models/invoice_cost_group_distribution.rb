# frozen_string_literal: true

class InvoiceCostGroupDistribution < ApplicationRecord
  belongs_to :cost_group
  belongs_to :invoice

  validates :cost_group, :invoice, :weight, presence: true
  validates :weight, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
