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
end
