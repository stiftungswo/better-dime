# frozen_string_literal: true

class Offer < ApplicationRecord
  belongs_to :accountant, class_name: 'Employee', foreign_key: 'accountant_id', inverse_of: :offers
  belongs_to :customer
  belongs_to :address
  belongs_to :rate_group

  has_many :offer_discounts, dependent: :destroy
  has_many :offer_positions, dependent: :destroy
  has_one :project, dependent: :restrict_with_exception

  accepts_nested_attributes_for :offer_positions, :offer_discounts, allow_destroy: true

  validates :accountant, :customer, :address,
            :description, :name, :rate_group,
            :short_description, :status, presence: true

  validates :name, length: { maximum: 255 }

  def breakdown
    CostBreakdown.new(offer_positions, offer_discounts, position_groupings, fixed_price).calculate
  end

  def position_groupings
    offer_positions.uniq {|p| p.position_group&.id }.map { |p| p.position_group }.select{ |g| not g.nil? }
  end

  def invoice_ids
    project&.invoices&.map { |i| i.id } || []
  end
end
