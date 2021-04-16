# frozen_string_literal: true

module V2
  class ProjectsController < APIController
    include V2::Concerns::ParamsAuthenticatable

    before_action :set_project, only: [:show, :update, :destroy, :create_invoice, :effort_report]

    def index
      @q = Project.order(id: :desc).ransack(search_params)
      @projects = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
      @invoices_counts = ProjectCalculator.invoices_counts @projects
      @positions_counts = ProjectCalculator.positions_counts @projects
    end

    def show
      @project
    end

    def update
      # destroy project positions which were not passed along to the params
      ParamsModifier.destroy_missing params, @project.project_positions, :positions
      # destroy costgroup distributions which were not passed along to the params
      ParamsModifier.destroy_missing params, @project.project_costgroup_distributions, :costgroup_distributions

      raise ValidationError, @project.errors unless @project.update(update_params)

      render :show
    end

    def create
      @project = Project.new(update_params)

      raise ValidationError, @project.errors unless @project.save

      render :show
    end

    def destroy
      raise ValidationError, @project.errors unless @project.discard
    end

    def duplicate
      @project = Project.find(params[:id]).deep_clone include: [:project_positions, :project_costgroup_distributions]
      # update any rate units which might be archived (if possible) when
      # duplicating (since we are possibly duplicating old projects)
      RateUnitUpdater.update_rate_units @project.project_positions, @project.rate_group

      @project.offer = nil

      raise ValidationError, @project.errors unless @project.save

      render :show
    end

    def create_invoice
      @invoice = InvoiceCreator.create_invoice_from_project @project

      raise ValidationError, @invoice.errors unless @invoice.save

      render "v2/invoices/show"
    end

    def potential_invoices
      @projects = Project.left_joins(:invoices, project_positions: :project_efforts).select(
        "projects.id, projects.name, MAX(date) as last_effort_date, MAX(ending) as last_invoice_date"
      ).group(:id)
      @candidate_projects = @projects.page(legacy_params[:page]).per(legacy_params[:pageSize])
      @projects_wp_invoices = @candidate_projects.select do |p|
        p.last_invoice_date.nil? || (p.last_effort_date && (p.last_effort_date > p.last_invoice_date))
      end
    end

    def effort_report
      pdf = Pdfs::ProjectEffortReportPdf.new GlobalSetting.first, @project

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline"
        end
      end
    end

    private

    def set_project
      @project = Project.find(params[:id])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :showArchived, :filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_false] = true if legacy_params[:showArchived] == "false"
      search[:id_or_name_or_description_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_name_or_description_cont)
    end

    def update_params
      ParamsModifier.copy_attributes params, :positions, :project_positions_attributes
      ParamsModifier.copy_attributes params, :costgroup_distributions, :project_costgroup_distributions_attributes

      params.permit(
        :accountant_id, :address_id, :customer_id, :description, :name, :rate_group_id,
        :deadline, :archived, :chargeable, :vacation_project, :fixed_price, :category_id,
        project_positions_attributes: [:id, :vat, :price_per_rate, :rate_unit_id, :service_id, :description, :order, :position_group_id, :_destroy],
        project_costgroup_distributions_attributes: [:id, :weight, :costgroup_number, :_destroy]
      )
    end
  end
end
