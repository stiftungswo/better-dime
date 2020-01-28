# frozen_string_literal: true

class ProjectEffort < ApplicationRecord
  belongs_to :employee
  belongs_to :project_position, foreign_key: 'position_id'

  validates :date, :value, presence: true
  validates :value, numericality: { greater_than_or_equal_to: 0 }
  validates :date, timeliness: { type: :date }
end
