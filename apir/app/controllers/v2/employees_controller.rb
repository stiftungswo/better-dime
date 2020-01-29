module V2
  class EmployeesController < APIController
    def index
      @q = Employee.includes(:employee_group).order(created_at: :desc).ransack(search_params)
      @employees = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @employee = Employee.find(params[:id]).decorate
    end

    private
    
    def employee_params
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir,:showArchived,:filterSearch, :page, :pageSize)
    end

    # Also map the old params to new ransack params till the frontend is adapted
    def search_params
      search = params.fetch(:q, {})
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_true] ||= legacy_params[:showArchived]
      search[:id_or_first_name_or_last_name_or_email_or_employee_group_name_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_true, :id_or_first_name_or_last_name_or_email_or_employee_group_name_cont)
    end
  end
end
