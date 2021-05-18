# frozen_string_literal: true

class Project < ApplicationRecord
  include SoftDeletable

  belongs_to :accountant, class_name: "Employee", foreign_key: "accountant_id", inverse_of: :projects
  belongs_to :customer
  belongs_to :address
  belongs_to :project_category, foreign_key: :category_id, optional: true
  belongs_to :offer, optional: true
  belongs_to :rate_group

  has_many :invoices, dependent: :restrict_with_exception
  has_many :project_comments, dependent: :destroy
  has_many :project_costgroup_distributions, dependent: :destroy
  has_many :project_category_distributions, dependent: :destroy
  has_many :project_positions, dependent: :destroy
  has_many :project_efforts, through: :project_positions, dependent: :restrict_with_exception
  has_many :costgroups, through: :project_costgroup_distributions, dependent: :restrict_with_exception
  has_many :project_categories, through: :project_category_distributions, dependent: :restrict_with_exception

  accepts_nested_attributes_for :project_positions, :project_costgroup_distributions, :project_category_distributions, allow_destroy: true

  validates :fixed_price, numericality: { only_integer: true }, allow_nil: true
  validates :accountant, :address, :name, :rate_group, presence: true
  validates :project_category, presence: true, if: :should_validate_category?

  delegate :budget_price, :budget_time, :current_price, :current_time, to: :project_calculator

  def listing_name
    name + (archived ? " [A]" : "")
  end

  def project_category_distributions
    [{category_id: category_id, project_id: id, weight: 100}]
  end

  def project_calculator
    @project_calculator ||= ProjectCalculator.new self
  end

  def breakdown
    @breakdown ||= CostBreakdown.new(project_positions, [], position_groupings, fixed_price).calculate
  end

  def position_groupings
    project_positions.uniq { |p| p.position_group&.id }.map(&:position_group).select { |g| g }
  end

  def invoice_ids
    invoices&.select { |i| i.deleted_at.nil? } .map(&:id) || []
  end

  def should_validate_category?
    # if we only archive or unarchive the project we don't validate the project category
    # if it is a new record we don't validate either
    offer.blank? || (!new_record? && changed != ["archived"])
  end
end
