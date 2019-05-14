class InvoicePosition < ApplicationRecord
  belongs_to :invoice
  belongs_to :rate_unit
end
