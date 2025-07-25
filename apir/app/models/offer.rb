# frozen_string_literal: true

class Offer < ApplicationRecord
  include SoftDeletable

  belongs_to :accountant, class_name: "Employee", foreign_key: "accountant_id", inverse_of: :offers
  belongs_to :customer
  belongs_to :address
  belongs_to :rate_group
  belongs_to :location, optional: true

  has_one :project, dependent: :restrict_with_exception
  has_many :offer_costgroup_distributions, dependent: :destroy
  has_many :offer_category_distributions, dependent: :destroy
  has_many :offer_discounts, dependent: :destroy
  has_many :offer_positions, dependent: :destroy

  has_many :costgroups, through: :offer_costgroup_distributions, dependent: :restrict_with_exception
  has_many :project_categories, through: :offer_category_distributions, dependent: :restrict_with_exception

  accepts_nested_attributes_for :offer_positions, :offer_discounts, :offer_costgroup_distributions, :offer_category_distributions, allow_destroy: true

  validates :accountant, :customer, :address,
            :description, :name, :rate_group,
            :short_description, :status, presence: true

  validates :name, length: { maximum: 255 }
  validates :fixed_price, numericality: { only_integer: true }, if: -> { fixed_price.present? }
  validates :fixed_price_vat, numericality: { greater_than_or_equal_to: 0 }, if: -> { fixed_price_vat.present? }

  def breakdown
    CostBreakdown.new(offer_positions, offer_discounts, costgroup_distribution, position_groupings, fixed_price, fixed_price_vat || 0.077).calculate
  end

  def costgroup_distribution
    count = offer_costgroup_distributions.count

    offer_costgroup_distributions.to_h do |ocd|
      [ocd.costgroup_number, 100 / count]
    end
  end

  def position_groupings
    offer_positions.uniq { |p| p.position_group&.id }.map(&:position_group).select { |g| g }
  end

  def invoice_ids
    project&.invoices&.map(&:id) || []
  end
end
