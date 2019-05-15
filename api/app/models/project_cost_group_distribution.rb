# frozen_string_literal: true

class ProjectCostGroupDistribution < ApplicationRecord
  belongs_to :cost_group
  belongs_to :project
end
