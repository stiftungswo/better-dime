module V2
  class EmployeesController < APIController
    def index
      @q = Employee.includes(:employee_group).order(created_at: :desc).ransack(search_params)
      @employees = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @employee = Employee.includes(work_periods: [:employee]).find(params[:id]).decorate
    end

    def create
      @employee = Employee.new(employee_params.except(:id))

      respond_to do |format|
        if @employee.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @employee = Employee.find(params[:id])
      @employee.work_periods.where.not(id: employee_params[:work_periods_attributes].map {|work_period| work_period[:id]}).discard_all

      respond_to do |format|
        if @employee.update(employee_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @employee = Employee.find(params[:id])

      respond_to do |format|
        if @employee.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee.errors, status: :unprocessable_entity }
        end
      end
    end

    # this api could easily be done in #update
    def archive
      @employee = Employee.find(params[:id])

      respond_to do |format|
        if @employee.update(archived: params[:archived])
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee.errors, status: :unprocessable_entity }
        end
      end
    end

    def duplicate
      @employee = Employee.find(params[:id]).duplicate

      respond_to do |format|
        if @employee.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee.errors, status: :unprocessable_entity }
        end
      end
    end

    private
    
    def employee_params
      params.require(:employee)
      params[:employee][:work_periods_attributes] = params[:work_periods]
      params[:employee][:employee_group_id] = params[:employee_group_id]
      params[:employee][:password] = params[:password]
      params.require(:employee).permit(:id, :password, :email, :is_admin, :first_name, :last_name, :can_login, :archived,
        :holidays_per_year, :employee_group_id, :first_vacation_takeover, work_periods_attributes: [:id, :ending, :pensum, :beginning, :yearly_vacation_budget])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir,:showArchived,:filterSearch, :page, :pageSize)
    end

    # Also map the old params to new ransack params till the frontend is adapted
    def search_params
      search = params.fetch(:q, {})
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_false] = true if ["false",false, nil].include?(params[:showArchived])
      search[:id_or_first_name_or_last_name_or_email_or_employee_group_name_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_first_name_or_last_name_or_email_or_employee_group_name_cont)
    end
  end
end
