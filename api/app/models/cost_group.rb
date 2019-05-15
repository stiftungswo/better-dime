# frozen_string_literal: true

class CostGroup < ApplicationRecord
  has_many :project_cost_group_distributions, dependent: :restrict_with_exception
  has_many :invoice_cost_group_distributions, dependent: :restrict_with_exception
  has_many :projects, through: :project_cost_group_distributions, dependent: :restrict_with_exception
end
