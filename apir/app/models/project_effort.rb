# frozen_string_literal: true

class ProjectEffort < ApplicationRecord
  include SoftDeletable
  belongs_to :employee
  belongs_to :project_position, foreign_key: :position_id
  belongs_to :costgroup, foreign_key: :costgroup_number

  validates :date, :value, presence: true
  validates :value, numericality: { greater_than_or_equal_to: 0 }
  validates :date, timeliness: { type: :date }

  def price
    project_position.price_per_rate * value / project_position.rate_unit.factor
  end
end
