# frozen_string_literal: true
# This code is a hot mess
# Many values are calculated dynamically but should be peristed.
# This means any change in logic might change the current balances, even if the change only affects the past.
# The naming is still matching the php naming and should be changed in the future.

class WorkPeriod < ApplicationRecord
  include SoftDeletable
  belongs_to :employee

  validates :beginning, :ending, :pensum, :yearly_vacation_budget, presence: true
  validates :pensum, numericality: { only_integer: true, greater_than: 0 }
  validates :beginning, :ending, timeliness: { type: :date }
  validates :ending, timeliness: { on_or_after: :beginning }

  def overlapping_periods?
    employee.work_periods.where(beginning: duration).where.not(id: id).or(
      employee.work_periods.where(ending: duration).where.not(id: id)
    ).any?
  end

  # Collectes the spent/booked holiday minutes
  # Holidays and Public Holidays are not the same thing but named the same in this class
  def booked_holiday_minutes
    booked_effort.where("projects.vacation_project" => true).sum(:value)
  end

  def remaining_vacation_budget
    period_vacation_budget - booked_holiday_minutes
  end

end
