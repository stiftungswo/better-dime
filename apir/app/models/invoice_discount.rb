# frozen_string_literal: true

class InvoiceDiscount < ApplicationRecord
  include SoftDeletable
  belongs_to :invoice

  validates :name, :value, presence: true
  validates :value, numericality: { greater_than: 0 }
end
