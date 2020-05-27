# frozen_string_literal: true

class WorkPeriodCalculator
  def initialize(work_periods)
    @work_periods = work_periods.sort_by { |a| [a.beginning, a.ending] }
    @holidays = Holiday.all
  end

  def calculate
    if @work_periods.empty?
      []
    else
      placeholders = @work_periods.map { |period| create_placeholder period }
      efforts = ProjectEffort.joins(project_position: [:rate_unit, :project]).where(
        employee_id: @work_periods.first[:employee_id],
        project_positions: { rate_units: { is_time: true } }
      ).select("project_efforts.*, projects.vacation_project as vacation_project")

      placeholders.each do |period|
        calculate_vacation_takeover placeholders, period
        calculate_booked_minutes period, efforts
        calculate_effective_time period
        calculate_target_time period
        calculate_target_time_till_today period
        calculate_period_vacation_budget period
        calculate_remaining_vacation_budget period, efforts
        calculate_effort_till_today period
        calculate_overlapping_periods placeholders, period
      end

      placeholders.reverse
    end
  end

  private

  # :nocov:
  def create_placeholder(work_period)
    {
      id: work_period.id,
      employee_id: work_period.employee_id,
      beginning: work_period.beginning,
      ending: work_period.ending,
      pensum: work_period.pensum,
      yearly_vacation_budget: work_period.yearly_vacation_budget,
      overlapping_periods: false,
      vacation_takeover: 0.0,
      booked_minutes: 0.0,
      effective_time: 0.0,
      effort_till_today: 0.0,
      period_vacation_budget: 0.0,
      target_time: 0.0,
      remaining_vacation_budget: 0.0
    }
  end

  # Harcoded today but probably shouldn't be
  def work_hours_per_day
    8.4
  end

  def work_minutes_per_day
    work_hours_per_day * 60
  end

  def duration(period)
    period[:beginning]..period[:ending]
  end

  def duration_till_today(period)
    today = Date.today
    (period[:beginning]..period[:ending]).select { |day| day <= today }
  end

  def get_previous_work_period(periods, period)
    last = periods.select { |p| p[:ending] <= period[:beginning] }.sort_by { |a| a[:ending] }.reverse.first
    # get the longest period which hast the same ending as the last period before the current one
    periods.select { |p| p[:ending] == last[:ending] }.min_by { |a| a[:beginning] } if last
  end

  def calculate_booked_minutes(period, efforts)
    period[:booked_minutes] = efforts.select { |e| (period[:beginning]..period[:ending]) === e.date }.inject(0) do |sum, e|
      sum + e.value
    end.to_f
  end

  def calculate_vacation_takeover(periods, period)
    previous_work_period = get_previous_work_period periods, period

    period[:vacation_takeover] = if previous_work_period
                                   previous_work_period[:effort_till_today].to_f + previous_work_period[:remaining_vacation_budget].to_f
                                 else
                                   Employee.find(period[:employee_id]).first_vacation_takeover.to_f
                                 end
  end

  def calculate_effective_time(period)
    period[:effective_time] = period[:booked_minutes].to_f + period[:vacation_takeover].to_f
  end

  def calculate_target_time_till_today(period)
    target_work_minutes_till_today = duration_till_today(period).count(&:on_weekday?) * work_minutes_per_day
    public_holiday_minutes_till_today = @holidays.select { |h| duration(period) === h.date }.inject(0) do |sum, h|
      sum + h.duration.to_f
    end.to_f
    period[:target_time_till_today] = (target_work_minutes_till_today - public_holiday_minutes_till_today) * period[:pensum] / 100.0
  end

  def calculate_target_time(period)
    target_work_minutes = duration(period).count(&:on_weekday?) * work_minutes_per_day
    public_holiday_minutes = @holidays.select { |h| duration(period) === h.date }.inject(0) do |sum, h|
      sum + h.duration.to_f
    end.to_f
    period[:target_time] = (target_work_minutes - public_holiday_minutes) * period[:pensum] / 100.0
  end

  def calculate_period_vacation_budget(period)
    worked_time_p_year = (period[:beginning]..period[:ending]).count(&:on_weekday?) * work_minutes_per_day
    target_time_p_year = (period[:beginning].beginning_of_year..period[:ending].end_of_year).count(&:on_weekday?) * work_minutes_per_day
    budgets_in_years = (period[:ending].year - period[:beginning].year + 1) * period[:yearly_vacation_budget]
    period[:period_vacation_budget] = (worked_time_p_year / target_time_p_year) * budgets_in_years * period[:pensum] / 100.0
  end

  def calculate_remaining_vacation_budget(period, efforts)
    holiday_efforts = efforts.select { |e| (period[:beginning]..period[:ending]) === e.date && e.vacation_project == 1 }
    booked_holiday = holiday_efforts.inject(0) do |sum, e|
      sum + e.value
    end.to_f
    period[:remaining_vacation_budget] = period[:period_vacation_budget] - booked_holiday
  end

  def calculate_effort_till_today(period)
    period[:effort_till_today] = period[:effective_time] - period[:target_time_till_today]
  end

  def calculate_overlapping_periods(periods, period)
    period[:overlapping_periods] = periods.any? do |p|
      overlap = (period[:beginning]..period[:ending]) === p[:beginning] || (period[:beginning]..period[:ending]) === p[:ending]
      overlap && p != period
    end
  end
  # :nocov:
end
