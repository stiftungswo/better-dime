# frozen_string_literal: true

class InvoiceDiscount < ApplicationRecord
  belongs_to :invoice
end
