# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :accountant, class_name: 'Employee', foreign_key: 'accountant_id', inverse_of: :invoices
  belongs_to :customer
  belongs_to :address
  belongs_to :project

  has_many :invoice_discounts, dependent: :destroy
  has_many :invoice_positions, dependent: :destroy
end
