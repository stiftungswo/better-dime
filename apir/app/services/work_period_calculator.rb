# frozen_string_literal: true

class WorkPeriodCalculator
  def initialize(work_periods)
    @work_periods = work_periods.sort_by {|a| [a.beginning, a.ending]}.reverse!
  end

  def calculate
    placeholders = @work_periods.map {|period| create_placeholder period}

    calculate_booked_minutes placeholders
    calculate_effective_time placeholders
    calculate_target_minutes_till_today placeholders
    calculate_effort_till_today placeholders

    # placeholders.map {|w| w.except(:booked_minutes)}
  end

  private

  def create_placeholder(work_period)
    {
      id: work_period.id,
      employee_id: work_period.employee_id,
      beginning: work_period.beginning,
      ending: work_period.ending,
      pensum: work_period.pensum,
      yearly_vacation_budget: work_period.yearly_vacation_budget,
      overlapping_periods: work_period.overlapping_periods?,
      vacation_takeover: 0,
      booked_minutes: 0,
      effective_time: 0,
      effort_till_today: 0,
      period_vacation_budget: 0,
      target_time: 0,
      remaining_vacation_budget: 0,
    }
  end

  def calculate_booked_minutes(periods)
    periods.each do |period|
      period[:booked_minutes] = ProjectEffort.joins(project_position: :rate_unit).where(
        employee_id: period[:employee_id],
        date: [period[:beginning]..period[:ending]],
        :project_positions => {:rate_units => {is_time: true}}
      ).sum(:value)
    end
  end

  def calculate_effective_time(periods)
    periods.each do |period|
      period[:effective_time] = period[:booked_minutes] + period[:vacation_takeover]
    end
  end

  def calculate_target_minutes_till_today(periods)
    periods.each do |period|
      period[:target_minutes_till_today] = 100
    end
  end

  def calculate_effort_till_today(periods)
    periods.each do |period|
      period[:effort_till_today] = period[:effective_time] - period[:target_minutes_till_today]
    end
  end
end
