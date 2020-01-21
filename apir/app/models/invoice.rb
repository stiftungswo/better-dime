# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :accountant, class_name: 'Employee', foreign_key: 'accountant_id', inverse_of: :invoices
  belongs_to :customer
  belongs_to :address
  belongs_to :project

  has_many :invoice_discounts, dependent: :destroy
  has_many :invoice_positions, dependent: :destroy
  has_many :invoice_cost_group_distributions, dependent: :destroy

  validates :accountant, :address, :description, :start, :end, :name, presence: true
  validates :start, :end, timeliness: { type: :date }
  validates :end, timeliness: { after: :start }
  validates :fixed_price, numericality: { only_integer: true }, if: -> { fixed_price.present? }
  validates :fixed_price_vat, numericality: { greater_than_or_equal_to: 0 }, if: -> { fixed_price_vat.present? }
end
