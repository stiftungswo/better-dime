# frozen_string_literal: true

class InvoiceCostGroupDistribution < ApplicationRecord
  belongs_to :costgroup
  belongs_to :invoice

  validates :costgroup, :invoice, :weight, presence: true
  validates :weight, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
