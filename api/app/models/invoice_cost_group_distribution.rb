# frozen_string_literal: true

class InvoiceCostGroupDistribution < ApplicationRecord
  belongs_to :cost_group
  belongs_to :invoice
end
