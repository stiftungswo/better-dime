module V2
  class EmployeesController < APIController
    def index
      @q = Employee.includes(:employee_group).order(created_at: :desc).ransack(search_params)
      @employees = @q.result.page(params[:page]).per(params[:pageSize])
    end

    def show
      @employee = Employee.find(params[:id]).decorate
    end

    private
    
    def employee_params
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{params[:orderByTag]} #{params[:orderByDir]}"
      search[:archived_true] ||= params[:showArchived]
      search[:first_name_or_last_name_or_email_or_employee_group_name_cont] ||= params[:filterSearch]
      search
    end
  end
end
