# frozen_string_literal: true

class Service < ApplicationRecord
  include SoftDeletable
  has_many :service_rates, dependent: :restrict_with_exception
  has_many :offer_positions, dependent: :restrict_with_exception
  has_many :project_positions, dependent: :restrict_with_exception

  accepts_nested_attributes_for :service_rates, allow_destroy: true

  belongs_to :service_category, optional: true

  validates :name, :vat, :order, presence: true
  validates :vat, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 1 }
  # order among services in the same category
  validates :local_order, numericality: { greater_than_or_equal_to: 0, only_integer: true, less_than_or_equal_to: 99 }

  def order
    100*(service_category.present?  ? service_category.order : 9999) + local_order
  end
end
