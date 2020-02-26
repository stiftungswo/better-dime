module V2
  class DailyReportsController < APIController
    def index
      from_date = DateTime.parse(params[:from]) || DateTime.new(2019,1,1)
      to_date = DateTime.parse(params[:to]) || DateTime.now()

      @dates = (from_date..to_date)
      @employee_efforts = calculate_efforts ProjectEffort.includes(:employee, project_position: [:service]).where(date: @dates), @dates
    end

    def calculate_efforts(efforts, dates)
      employees = efforts.map {|effort| effort.employee}.uniq
      employee_efforts = []
      employees.each do |employee|
        employee_efforts.push({
          employee_id: employee.id,
          name: employee.full_name,
          efforts: dates.map do |date|
            [date.strftime('%F'), get_efforts_for_employee_date(efforts, employee, date)]
          end.select {|t| t[1].length > 0}.to_h
        })
      end

      employee_efforts
    end

    def get_efforts_for_employee_date(efforts, employee, date)
      efforts.select {|e| e.employee == employee && e.date == date}.map do |e| ({
        date: date.strftime('%F'),
        value: e.value,
        service_id: e.project_position.service.id,
        service_name: e.project_position.service.name
      })
      end
    end
  end
end
