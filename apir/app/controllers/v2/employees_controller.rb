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
      legacy = params.permit(:orderByTag, :orderByDir,:showArchived,:filterSearch)
      search = params.fetch(:q, {})
      search[:s] ||= "#{legacy[:orderByTag]} #{legacy[:orderByDir]}"
      search[:archived_true] ||= legacy[:showArchived]
      search[:first_name_or_last_name_or_email_or_employee_group_name_cont] ||= legacy[:filterSearch]
      search.permit(:s, :archived_true, :first_name_or_last_name_or_email_or_employee_group_name_cont)
    end
  end
end
