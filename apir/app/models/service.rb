# frozen_string_literal: true

class Service < ApplicationRecord
  include SoftDeletable
  has_many :service_rates, dependent: :restrict_with_exception
  has_many :offer_positions, dependent: :restrict_with_exception
  has_many :project_positions, dependent: :restrict_with_exception

  accepts_nested_attributes_for :service_rates, allow_destroy: true

  validates :name, :vat, :order, presence: true
  validates :vat, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 1 }
  validates :order, numericality: { greater_than_or_equal_to: 0, only_integer: true }
end
