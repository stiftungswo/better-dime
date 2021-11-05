# frozen_string_literal: true

class ProjectPosition < ApplicationRecord
  include SoftDeletable
  belongs_to :rate_unit
  belongs_to :service
  belongs_to :project
  belongs_to :position_group, optional: true

  has_many :project_efforts, foreign_key: :position_id, dependent: :restrict_with_exception
  # allow deletion of project positions without having to deal with old invoices
  has_many :invoice_position, dependent: :nullify

  validates :price_per_rate, :vat, :order, presence: true
  validates :vat, numericality: { greater_than_or_equal_to: 0 }
  validates :order, numericality: { only_integer: true }

  delegate :is_time, to: :rate_unit

  def calculated_vat
    price_per_rate * efforts_value * vat
  end

  def efforts_value
    (project_efforts.inject(0) { |sum, e| sum + e.value } / rate_unit.factor).round 2
  end

  def efforts_value_with_unit
    efforts_value.to_s + " " + rate_unit.effort_unit.to_s
  end

  delegate :archived, to: :rate_unit, prefix: true

  def deletable
    project_efforts.blank?
  end

  def charge
    price_per_rate * efforts_value + calculated_vat
  end
end
