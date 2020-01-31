# frozen_string_literal: true

class ProjectCostgroupDistribution < ApplicationRecord
  include SoftDeletable

  belongs_to :costgroup, foreign_key: :costgroup_number
  belongs_to :project

  validates :weight, presence: true
  validates :weight, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
