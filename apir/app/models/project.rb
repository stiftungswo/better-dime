# frozen_string_literal: true

class Project < ApplicationRecord
  include Discard::Model
  # don't show discarded records when calling .all
  default_scope -> { kept }
  # due compatibility issues with the previous PHP backend we use deleted_at for soft deletes
  self.discard_column = :deleted_at

  belongs_to :accountant, class_name: 'Employee', foreign_key: 'accountant_id', inverse_of: :projects
  belongs_to :customer
  belongs_to :address
  belongs_to :project_category, foreign_key: :category_id
  belongs_to :offer, optional: true
  belongs_to :rate_group

  has_many :invoices, dependent: :restrict_with_exception
  has_many :project_comments, dependent: :destroy
  has_many :project_costgroup_distributions, dependent: :destroy
  has_many :project_positions, dependent: :destroy

  accepts_nested_attributes_for :project_positions, :project_costgroup_distributions, allow_destroy: true

  validates :fixed_price, numericality: { only_integer: true }, allow_nil: true
  validates :accountant, :address, :name, :project_category, :rate_group, presence: true

  delegate :budget_price, :budget_time, :current_price, :current_time, to: :project_calculator

  def project_calculator
    @project_calculator ||= ProjectCalculator.new self
  end

  def position_groupings
    project_positions.uniq {|p| p.position_group&.id }.map { |p| p.position_group }.select{ |g| not g.nil? }
  end

  def invoice_ids
    invoices&.select{ |i| i.deleted_at.nil? } .map { |i| i.id } || []
  end
end
