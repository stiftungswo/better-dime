# frozen_string_literal: true

require "rails_helper"

RSpec.describe WorkPeriodCalculator do
  it "calculates the correct work periods for given periods" do
    # define some holidays (which will affect the work period calculator)
    holiday_a = create(:holiday, date: "2019-07-13", duration: 8)
    holiday_b = create(:holiday, date: "2019-08-13", duration: 8)
    holiday_c = create(:holiday, date: "2019-08-17", duration: 8)
    holiday_d = create(:holiday, date: "2019-08-23", duration: 8)

    employee = create(:employee)
    # define a working period
    work_periods = [
      create(
        :work_period,
        beginning: "2019-05-14".to_datetime,
        ending: "2020-04-16".to_datetime,
        pensum: 50,
        yearly_vacation_budget: 1080,
        employee: employee
      )
    ]

    # define some work that can be done
    position = create(:project_position)

    work_date_range = ("2019-05-14".to_datetime.."2020-04-16".to_datetime)
    # create a date range for the work period (but only use every third day to spice the test up)
    work_range = work_date_range.each_slice(3).map(&:first)

    work_range.each do |date|
      create(:project_effort, date: date, value: 1, project_position: position, employee: employee)
    end

    expected_result = {
      :beginning=>"2019-05-14".to_date,
      :ending=>"2020-04-16".to_date,
      :id=>work_periods[0].id,
      :booked_minutes=>113.0,
      :effective_time=>113.0,
      :effort_till_today=>-61107.0,
      :employee_id=>employee.id,
      :overlapping_periods=>false,
      :pensum=>50,
      :period_vacation_budget=>501.7973231357552,
      :remaining_vacation_budget=>501.7973231357552,
      :target_time=>61220.0,
      :target_time_till_today=>61220.0,
      :vacation_takeover=>0.0,
      :yearly_vacation_budget=>1080
    }

    got_result = (WorkPeriodCalculator.new(work_periods).calculate)[0]

    expect(got_result).to eq(expected_result)
  end

  it "calculates the correct work periods for no periods" do
    work_periods = []

    expect(WorkPeriodCalculator.new(work_periods).calculate).to eq([])
  end
end
