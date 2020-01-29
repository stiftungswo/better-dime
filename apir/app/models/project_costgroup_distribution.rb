# frozen_string_literal: true

class ProjectCostgroupDistribution < ApplicationRecord
  belongs_to :cost_group
  belongs_to :project

  validates :weight, presence: true
  validates :weight, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
