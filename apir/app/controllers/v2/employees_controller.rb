module V2
  class EmployeesController < APIController
    def index
      @q = Employee.ransack(params[:q])
      @employees = @q.result.page(params[:page])
    end

    private
    
    def employee_params
    end
  end
end
