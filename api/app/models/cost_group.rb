# frozen_string_literal: true

class CostGroup < ApplicationRecord
  has_many :project_cost_group_distributions, dependent: :restrict_with_exception
end
