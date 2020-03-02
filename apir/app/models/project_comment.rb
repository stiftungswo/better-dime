# frozen_string_literal: true

class ProjectComment < ApplicationRecord
  include SoftDeletable
  belongs_to :project

  validates :comment, :date, presence: true
  validates :date, timeliness: { type: :date }
end
