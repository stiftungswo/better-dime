# frozen_string_literal: true

class ProjectEffort < ApplicationRecord
  belongs_to :employee
  belongs_to :project_position
end
