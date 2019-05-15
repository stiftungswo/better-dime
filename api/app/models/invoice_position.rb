# frozen_string_literal: true

class InvoicePosition < ApplicationRecord
  belongs_to :invoice
  belongs_to :rate_unit
  belongs_to :project_position
end
