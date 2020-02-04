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

  # Harcoded today but probably shouldn't be
  def work_hours_per_day
    8.4
  end

  def work_minutes_per_day
    work_hours_per_day * 60
  end

  def pensum_in_percent
    pensum / 100.0
  end

  def duration
    beginning..ending
  end

  def overlapping_periods?
    employee.work_periods.where(beginning: duration).where.not(id: id).or(
      employee.work_periods.where(ending: duration).where.not(id: id)
    ).any?
  end

  # This method goes back across all WorkPeriods (and this on each WorkPeriod again...) to
  # get the current vacation takeover balance for the current WorkPeriod.
  # Correctly the vacation_takeover should be persistet per WorkPeriod and should 
  # be calculated either on demand and on creation of a new WorkPeriod.
  # Once a WorkPeriod is considered "done" there should be no more changes possible.
  def vacation_takeover
    return employee.first_vacation_takeover unless previous_work_period

    previous_work_period.remaining_vacation_budget + previous_work_period.effort_till_today
  end

  # Time who has been spent/booked, either vacations or projects
  def effective_time
    booked_minutes + vacation_takeover
  end

  # What has been spent/booked minus what should have been done till today
  # Falls apart when something is booked into the future
  def effort_till_today
    effective_time - target_minutes_till_today
  end

  # Collectes the spent/booked minutes from the projects, this includes holiday minutes too
  def booked_minutes
    booked_effort.sum(:value)
  end

  # Collectes the spent/booked holiday minutes
  # Holidays and Public Holidays are not the same thing but named the same in this class
  def booked_holiday_minutes
    booked_effort.where("projects.vacation_project" => true).sum(:value)
  end

  def remaining_vacation_budget
    period_vacation_budget - booked_holiday_minutes
  end

  # How many minutes of holidays can be spent during this WorkPeriod
  # Calculates slightly strange
  def period_vacation_budget
    yearly_vacation_budget / target_work_minutes_in_full_year * target_work_minutes_in_duration * pensum_in_percent
  end

  # returns the time in minutes which should be worked in the duration
  def target_time
    pensum_in_percent * (target_work_minutes_in_duration - public_holiday_minutes)
  end

  def target_work_minutes_in_duration
    duration.select(&:on_weekday?).count * work_minutes_per_day
  end

  def target_minutes_till_today
    (target_work_minutes_till_today - public_holiday_minutes_till_today) * pensum_in_percent
  end

  def target_work_minutes_till_today
    duration.select { |day| day <= Date.today }.select(&:on_weekday?).count * work_minutes_per_day
  end

  # Amount of minutes should be worked on weekdays regardless of Holidays
  def target_work_minutes_in_full_year
    (beginning.beginning_of_year..ending.end_of_year).select(&:on_weekday?).count * work_minutes_per_day
  end


  private

  def public_holiday_minutes_till_today
    Holiday.where(date: duration).where("date <= ?", Date.today).sum(:duration)
  end

  def public_holiday_minutes
    Holiday.where(date: duration).sum(:duration)
  end

  # It's more like booked minutes in project_positions
  def booked_effort
    employee.project_efforts.joins(project_position: [:project, :rate_unit])
            .where(date: duration).where("rate_units.is_time" => true)
  end

  def previous_work_period
    @previous_work_period ||= employee.work_periods.where("ending < ?", ending).where.not(id: id).order(ending: :desc, beginning: :asc).first
  end

end
