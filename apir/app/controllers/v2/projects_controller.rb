module V2
  class ProjectsController < ApplicationController
    before_action :set_project, only: %i[show update destroy]

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
      destroy_missing(:positions, @project.project_positions)
      # destroy costgroup distributions which were not passed along to the params
      destroy_missing(:costgroup_distributions, @project.project_costgroup_distributions)

      raise ValidationError, @project.errors unless @project.update(update_params)

      render :show
    end

    def create
      @project = Project.new(update_params)

      raise ValidationError, @project.errors unless @project.save

      render :show
    end

    def destroy
      raise ValidationError, @project.errors unless @project.destroy
    end

    private

    def set_project
      @project = Project.find(params[:id])
    end

    def destroy_missing(key, collection)
      unless params[key].blank?
        # destroy items which were not passed along in the params
        collection.each do |item|
          unless params[key].any? {|search_item| search_item[:id] == item.id }
            params[key].push({ id: item.id, _destroy: 1 })
          end
        end
      end
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir,:showArchived,:filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_true] ||= legacy_params[:showArchived]
      search[:id_or_name_or_description_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :id_or_name_or_description_cont)
    end

    def update_params
      params[:project_positions_attributes] = params[:positions]
      params[:project_costgroup_distributions_attributes] = params[:costgroup_distributions]
      params.permit(
        :accountant_id, :address_id, :customer_id, :description, :name, :rate_group_id,
        :deadline, :archived, :chargeable, :vacation_project, :fixed_price, :category_id,
        project_positions_attributes: [
          :id, :vat, :price_per_rate, :rate_unit_id, :service_id, :description, :order, :position_group_id, :_destroy
        ],
        project_costgroup_distributions_attributes: [
          :id, :weight, :costgroup_number, :_destroy
        ]
      )
    end

  end
end
