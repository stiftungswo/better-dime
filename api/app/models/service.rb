# frozen_string_literal: true

class Service < ApplicationRecord
  has_many :service_rates, dependent: :restrict_with_exception
  has_many :offer_positions, dependent: :restrict_with_exception
  has_many :project_positions, dependent: :restrict_with_exception

  validates :name, :vat, :archived, :order, presence: true
  validates :vat, numericality: { greater_than_or_equal_to: 0 }
  validates :order, numericality: { greater_than_or_equal_to: 0, only_integer: true }
end
