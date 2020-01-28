# frozen_string_literal: true

class ProjectPosition < ApplicationRecord
  belongs_to :rate_unit
  belongs_to :service
  belongs_to :project
  belongs_to :position_group

  has_many :project_efforts, foreign_key: 'position_id', dependent: :restrict_with_exception
  has_one :invoice_position, dependent: :restrict_with_exception

  validates :price_per_rate, :vat, :order, presence: true
  validates :vat, numericality: { greater_than_or_equal_to: 0 }
  validates :order, numericality: { only_integer: true }

  def efforts_value
    (project_efforts.inject(0) { |sum, e| sum + e.value } / rate_unit.factor).round 2
  end

  def calculated_vat
    price_per_rate * efforts_value * vat
  end

  def charge
    price_per_rate * efforts_value + calculated_vat
  end
end
