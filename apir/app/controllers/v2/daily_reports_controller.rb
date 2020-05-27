# frozen_string_literal: true

module V2
  class DailyReportsController < APIController
    before_action :authenticate_employee!

    def index
      from_date = DateTime.parse(params[:from]) || DateTime.new(2019, 1, 1)
      to_date = DateTime.parse(params[:to]) || DateTime.now

      @dates = (from_date..to_date)
      @employee_efforts = calculate_efforts ProjectEffort.includes(:employee, project_position: [:service]).where(date: @dates)
    end

    def calculate_efforts(efforts)
      employees = efforts.map(&:employee).uniq
      employees.map do |employee|
        {
          employee_id: employee.id,
          name: employee.full_name,
          efforts: get_efforts_for_employee(efforts, employee).group_by { |e| e[:date] }
        }
      end
    end

    def get_efforts_for_employee(efforts, employee)
      efforts.select { |e| (e.employee == employee) && e.project_position }.map do |e|
        {
          date: e.date.strftime("%F"),
          value: e.value,
          service_id: e.project_position.service.id,
          service_name: e.project_position.service.name
        }
      end
    end
  end
end
