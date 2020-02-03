# frozen_string_literal: true

class WorkPeriod < ApplicationRecord
  include SoftDeletable
  belongs_to :employee

  validates :beginning, :ending, :pensum, :yearly_vacation_budget, presence: true
  validates :pensum, numericality: { only_integer: true, greater_than: 0 }
  validates :beginning, :ending, timeliness: { type: :date }
  validates :ending, timeliness: { on_or_after: :beginning }

  # Harcoded today but probably shouldn't be
  def work_hours_per_day
    8.4
  end

  def work_minutes_per_day
    work_hours_per_day * 60
  end

  # It means we go back across all WorkPeriods...
  def vacation_takeover
    return (employee.first_vacation_takeover || 0).round unless previous_work_period
    (previous_work_period.remaining_vacation_budget + previous_work_period.effort_till_today).round
  end

  def previous_work_period
    employee.work_periods.where("ending < ?", ending).where.not(id: id).order(ending: :desc, beginning: :desc).first
  end

  def effective_time
    (booked_minutes + vacation_takeover).round
  end

  def booked_minutes
    booked_effort.sum(:value).round
  end

  def booked_holiday_minutes
    booked_effort.where("projects.vacation_project" => true).sum(:value)
  end

  def effort_till_today
    current_end = if ending.before?(Date.today) then ending
    elsif beginning.before?(Date.today) then beginning
    else
      Date.today
    end
    public_holiday_minutes_till_today = public_holidays.where("date < ?", current_end).sum(:duration)
    current_effort = effective_time - (pensum_in_percent * (work_minutes_in_duration(beginning..current_end) - public_holiday_minutes_till_today))
    current_effort.round
  end

  def period_vacation_budget
    period_work_minutes_of_year = work_minutes_in_duration
    total_work_minutes_of_year = work_minutes_in_duration(beginning.beginning_of_year..ending.end_of_year)
    (yearly_vacation_budget / total_work_minutes_of_year) * period_work_minutes_of_year * pensum_in_percent
  end

  def pensum_in_percent
    pensum / 100.0
  end

  # returns the target work time in minutes
  def minutes_to_work
    (pensum_in_percent * (work_minutes_in_duration - public_holiday_minutes)).round
  end
  # Legacy naming
  alias target_time minutes_to_work

  def remaining_vacation_budget
    (period_vacation_budget - booked_holiday_minutes).round
  end

  def overlapping_periods
    employee.work_periods.where(beginning: duration).where.not(id: id).or(
      employee.work_periods.where(ending: duration).where.not(id: id))
  end

  def overlapping_periods?
    overlapping_periods.any?
  end

  def duration
    beginning..ending
  end

  def duration_years
    beginning.beginning_of_year..ending.end_of_year
  end

  def work_minutes_in_duration(range = duration)
    range.select(&:on_weekday?).count * work_minutes_per_day
  end

  private

  def public_holiday_minutes
    public_holidays.sum(:duration)
  end

  def public_holidays
    Holiday.where(date: duration)
  end

  def booked_effort
    employee.project_efforts.joins(project_position: [:project, :rate_unit]).
      where(date: duration).where("rate_units.is_time" => true)
  end
end
