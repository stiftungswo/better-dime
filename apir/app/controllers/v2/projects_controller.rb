module V2
  class ProjectsController < ApplicationController
    before_action :set_project, only: %i[show update destroy]

    def index
      @q = Project.includes(:invoices, project_positions: [:rate_unit, :project_efforts],
                            offer: [:offer_discounts, {offer_positions: :rate_unit}]).order(id: :desc).ransack(search_params)
      @projects = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @project
    end

    def update
      raise ValidationError, @project.errors unless @project.update(params)

      render :show
    end

    private

    def set_project
      @project = Project.find(params[:id])
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

  end
end
