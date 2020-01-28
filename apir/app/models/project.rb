# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :accountant, class_name: 'Employee', foreign_key: 'accountant_id', inverse_of: :projects
  belongs_to :customer
  belongs_to :address
  belongs_to :project_category
  belongs_to :offer
  belongs_to :rate_group

  has_many :invoices, dependent: :restrict_with_exception
  has_many :project_comments, dependent: :destroy
  has_many :project_cost_group_distributions, dependent: :destroy
  has_many :project_positions, dependent: :destroy

  validates :fixed_price, numericality: { only_integer: true }
  validates :accountant, :address, :archived,
            :chargeable, :name, :project_category,
            :rate_group, presence: true

  def position_groupings
    project_positions.uniq {|p| p.position_group&.id }.map { |p| p.position_group }.select{ |g| not g.nil? }
  end

  def invoice_ids
    invoices&.map { |i| i.id } || []
  end

  def budget_price
    if offer.nil?
      nil
    else
      if offer.fixed_price.nil?
        CostBreakdown.new(offer.offer_positions, offer.offer_discounts, offer.position_groupings, offer.fixed_price).calculate[:total]
      else
        offer.fixed_price
      end
    end
  end

  def budget_time
    if offer.nil?
      nil
    else
      offer.offer_positions.inject(0) { |sum, p| sum + p.estimated_work_hours }
    end
  end

  def current_price
    project_positions.inject(0) { |sum, p| sum + p.charge }
  end

  def current_time
    project_positions.inject(0) do |sum, p|
      if p.rate_unit.nil? or not p.rate_unit.is_time
        sum
      else
        sum + p.efforts_value * p.rate_unit.factor
      end
    end
  end
end
