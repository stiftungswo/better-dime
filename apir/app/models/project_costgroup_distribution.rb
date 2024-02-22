# frozen_string_literal: true

class ProjectCostgroupDistribution < ApplicationRecord
  include SoftDeletable

  belongs_to :costgroup, foreign_key: :costgroup_number
  belongs_to :project
end
