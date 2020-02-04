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
    return employee.first_vacation_takeover unless previous_work_period

    previous_work_period.remaining_vacation_budget + previous_work_period.effort_till_today
  end

  def previous_work_period
    employee.work_periods.where("ending < ?", ending).where.not(id: id).order(ending: :desc, beginning: :asc).first
  end

  def effective_time
    booked_minutes + vacation_takeover
  end

  def booked_minutes
    booked_effort.sum(:value)
  end

  def booked_holiday_minutes
    booked_effort.where("projects.vacation_project" => true).sum(:value)
  end

  def effort_till_today
    effective_time - target_minutes_till_today
  end

  def period_vacation_budget
    yearly_vacation_budget / target_work_minutes_in_full_year * target_work_minutes_in_duration * pensum_in_percent
  end

  def actual_yearly_vacation_budget; end

  def pensum_in_percent
    pensum / 100.0
  end

  # returns the target work time in minutes
  def target_time
    pensum_in_percent * (target_work_minutes_in_duration - public_holiday_minutes)
  end

  def remaining_vacation_budget
    period_vacation_budget - booked_holiday_minutes
  end

  def overlapping_periods
    employee.work_periods.where(beginning: duration).where.not(id: id).or(
      employee.work_periods.where(ending: duration).where.not(id: id)
    )
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

  def target_work_minutes_in_duration
    duration.select(&:on_weekday?).count * work_minutes_per_day
  end

  def target_work_minutes_in_full_year
    (beginning.beginning_of_year..ending.end_of_year).select(&:on_weekday?).count * work_minutes_per_day
  end

  def target_work_minutes_till_today
    duration.select { |day| day <= Date.today }.select(&:on_weekday?).count * work_minutes_per_day
  end

  def target_minutes_till_today
    (target_work_minutes_till_today - public_holiday_minutes_till_today) * pensum_in_percent
  end

  private

  def public_holiday_minutes_till_today
    Holiday.where(date: duration).where("date <= ?", Date.today).sum(:duration)
  end

  def public_holiday_minutes
    Holiday.where(date: duration).sum(:duration)
  end

  def booked_effort
    employee.project_efforts.joins(project_position: [:project, :rate_unit])
            .where(date: duration).where("rate_units.is_time" => true)
  end
end
