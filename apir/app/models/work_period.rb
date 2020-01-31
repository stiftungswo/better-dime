# frozen_string_literal: true

class WorkPeriod < ApplicationRecord
  include SoftDeletable
  belongs_to :employee

  validates :start, :end, :pensum, :vacation_takeover, :yearly_vacation_budget, presence: true
  validates :pensum, numericality: { only_integer: true, greater_than: 0 }
  validates :vacation_takeover, numericality: { greater_than_or_equal_to: 0 }
  validates :start, :end, timeliness: { type: :date }
  validates :end, timeliness: { after: :start }
end
