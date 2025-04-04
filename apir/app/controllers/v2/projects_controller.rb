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
      @calculate_costgroup_distributions = params[:calculate_costgroup_distributions] == "true"
      @project
    end

    def update
      # destroy project positions which were not passed along to the params
      ParamsModifier.destroy_missing params, @project.project_positions, :positions
      # destroy costgroup distributions which were not passed along to the params
      ParamsModifier.destroy_missing params, @project.project_costgroup_distributions, :costgroup_distributions
      ParamsModifier.destroy_missing params, @project.project_category_distributions, :category_distributions

      PositionGroupUpdater.update_all(groupings_params[:position_groupings])

      raise ValidationError, @project.errors unless @project.update(update_params)

      # replace shared position groups by new ones to enable modification in the frontend
      raise ValidationError, @project.errors if PositionGroupRemapper.remap_shared_groups(@project.position_groupings, @project.project_positions) && !@project.save

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
      @project = Project.find(params[:id]).deep_clone include: [:project_positions, :project_costgroup_distributions, :project_category_distributions]
      # create new position groups
      PositionGroupRemapper.remap_all_groups(@project.position_groupings, @project.project_positions)
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
      @q = Project.left_joins(:invoices, project_positions: :project_efforts).select(
        "projects.id, projects.name, MAX(date) as last_effort_date, MAX(ending) as last_invoice_date"
      ).group(:id).order(id: :desc).having("last_invoice_date IS NULL OR (last_effort_date AND (last_effort_date > last_invoice_date))")
      @q2 = @q.ransack(search_params).result.order(search_params[:s])
      @projects_wp_invoices = @q2.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def effort_report
      pdf = Pdfs::ProjectEffortReportPdf.new GlobalSetting.first, @project, params[:city]

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline", filename: "#{pdf.filename}.pdf"
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
      # Could have a more prettier solution
      search[:s] = "name asc" if search[:s] == "listing_name asc"
      search[:s] = "name desc" if search[:s] == "listing_name desc"
      search[:archived_false] = true if legacy_params[:showArchived] == "false"
      search[:id_or_name_or_description_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_name_or_description_cont)
    end

    def groupings_params
      params.permit(
        position_groupings: [:id, :name, :order, :shared]
      )
    end

    def update_params
      ParamsModifier.copy_attributes params, :positions, :project_positions_attributes
      ParamsModifier.copy_attributes params, :costgroup_distributions, :project_costgroup_distributions_attributes
      ParamsModifier.copy_attributes params, :category_distributions, :project_category_distributions_attributes

      params.permit(
        :accountant_id, :address_id, :customer_id, :description, :name, :rate_group_id, :location_id,
        :deadline, :archived, :chargeable, :vacation_project, :fixed_price, :category_id,
        project_positions_attributes: [:id, :vat, :price_per_rate, :rate_unit_id, :service_id, :description, :order, :position_group_id, :_destroy],
        project_category_distributions_attributes: [:id, :weight, :category_id, :_destroy],
        project_costgroup_distributions_attributes: [:id, :weight, :costgroup_number, :_destroy]
      )
    end
  end
end
