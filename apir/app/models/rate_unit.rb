# frozen_string_literal: true

class RateUnit < ApplicationRecord
  include SoftDeletable
  has_many :service_rates, dependent: :restrict_with_exception
  has_many :offer_positions, dependent: :restrict_with_exception
  has_many :invoice_positions, dependent: :restrict_with_exception
  has_many :project_positions, dependent: :restrict_with_exception

  validates :billing_unit, :effort_unit, :factor,
            :is_time, :name, :archived, presence: true
  validates :factor, numericality: { greater_than: 0 }
end
