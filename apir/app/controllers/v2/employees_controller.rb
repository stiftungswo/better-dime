module V2
  class EmployeesController < APIController
    def index
      @employees = Employee.all
    end
  end
end
