# frozen_string_literal: true

module V2
  class EmployeesController < APIController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, unless: -> { request.format.pdf? }
    before_action :authenticate_from_params!, if: -> { request.format.pdf? }

    def index
      @q = Employee.includes(:employee_group).order(created_at: :desc).ransack(search_params)
      @employees = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @employee = Employee.includes(:addresses, work_periods: [:employee]).find(params[:id]).decorate
      @work_periods = WorkPeriodCalculator.new(@employee.work_periods).calculate
    end

    def create
      puts employee_params
      @employee = Employee.new(employee_params.except(:id).merge({ first_vacation_takeover: 0.0 }))
      puts @employee
      respond_to do |format|
        if @employee.save
          @work_periods = WorkPeriodCalculator.new(@employee.work_periods).calculate
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @employee = Employee.find(params[:id])
      @employee.work_periods.where.not(id: (employee_params[:work_periods_attributes] || []).map { |work_period| work_period[:id] }).discard_all
      @employee.addresses.where.not(id: (employee_params[:addresses_attributes] || []).map { |address| address[:id] }).discard_all

      respond_to do |format|
        if @employee.update(employee_params)
          @work_periods = WorkPeriodCalculator.new(@employee.work_periods).calculate
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
          @work_periods = WorkPeriodCalculator.new(@employee.work_periods).calculate
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
          @work_periods = WorkPeriodCalculator.new(@employee.work_periods).calculate
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee.errors, status: :unprocessable_entity }
        end
      end
    end

    #:nocov:
    def effort_report
      @employee = Employee.includes(project_efforts: [project_position: [:rate_unit, :service, :project]]).find(params[:id])
      @from = params[:start].blank? ? DateTime.now - 1.month : DateTime.parse(params[:start])
      @to = params[:end].blank? ? DateTime.now : DateTime.parse(params[:end])
      pdf = Pdfs::EmployeeEffortReportPdf.new GlobalSetting.first, @employee, @from, @to

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline", filename: pdf.filename + ".pdf"
        end
      end
    end
    #:nocov:

    private

    def employee_params
      params.require(:employee)
      params[:employee][:work_periods_attributes] = params[:work_periods]
      params[:employee][:addresses_attributes] = params[:addresses]
      params[:employee][:employee_group_id] = params[:employee_group_id] unless params[:employee_group_id].nil?
      params[:employee][:password] = params[:password] if params[:password].present?
      params.require(:employee).permit(
        :id,
        :password,
        :email,
        :is_admin,
        :first_name,
        :last_name,
        :can_login,
        :archived,
        :holidays_per_year,
        :employee_group_id,
        :locale,
        :first_vacation_takeover,
        work_periods_attributes: [
          :id, :ending, :pensum, :beginning, :yearly_vacation_budget, :hourly_paid
        ],
        addresses_attributes: [:id, :city, :country, :customer_id, :description, :zip, :street, :supplement, :hidden]
      )
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :showArchived, :filterSearch, :page, :pageSize)
    end

    # Also map the old params to new ransack params till the frontend is adapted
    def search_params
      search = params.fetch(:q, {})
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_false] = true if ["false", false, nil].include?(params[:showArchived])
      search[:id_or_first_name_or_last_name_or_email_or_employee_group_name_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_first_name_or_last_name_or_email_or_employee_group_name_cont)
    end
  end
end
