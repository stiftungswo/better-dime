# frozen_string_literal: true

class ProjectPosition < ApplicationRecord
  include SoftDeletable
  belongs_to :rate_unit
  belongs_to :service
  belongs_to :project

  has_many :project_efforts, dependent: :restrict_with_exception, foreign_key: :position_id
  has_one :invoice_position, dependent: :restrict_with_exception

  validates :price_per_rate, :vat, :order, presence: true
  validates :vat, numericality: { greater_than_or_equal_to: 0 }
  validates :order, numericality: { only_integer: true }
end
