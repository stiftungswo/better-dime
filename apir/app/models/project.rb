# frozen_string_literal: true

class Project < ApplicationRecord
  include SoftDeletable

  belongs_to :accountant, class_name: "Employee", foreign_key: "accountant_id", inverse_of: :projects
  belongs_to :customer
  belongs_to :address
  belongs_to :offer, optional: true
  belongs_to :rate_group
  belongs_to :location, optional: true

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
  # rubocop:disable Rails/RedundantPresenceValidationOnBelongsTo
  validates :accountant, :address, :name, :rate_group, presence: true
  # rubocop:enable Rails/RedundantPresenceValidationOnBelongsTo

  delegate :budget_price, :budget_time, :current_price, :current_time, to: :project_calculator
  delegate :costgroup_distribution, :costgroup_sums, :missing_costgroup_distribution, :costgroup_dist_incomplete?, to: :cost_group_breakdown

  def listing_name
    name + (archived ? " [A]" : "")
  end

  def project_calculator
    @project_calculator ||= ProjectCalculator.new self
  end

  def cost_group_breakdown
    @cost_group_breakdown ||= CostGroupBreakdownService.new self
  end

  def position_groupings
    project_positions.uniq { |p| p.position_group&.id }.map(&:position_group).select { |g| g }
  end

  def invoice_ids
    invoices&.select { |i| i.deleted_at.nil? }&.map(&:id) || []
  end
end
