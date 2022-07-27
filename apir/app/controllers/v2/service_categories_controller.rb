# frozen_string_literal: true

module V2
  class ServiceCategoriesController < APIController
    before_action :authenticate_employee!

    def index
      @q = ServiceCategory.includes(:parent_category).order(created_at: :desc).ransack(search_params)
      @service_categories = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @service_category = ServiceCategory.find(params[:id]).decorate
    end

    def create
      @service_category = ServiceCategory.new(service_category_params.except(:id))

      respond_to do |format|
        if @service_category.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @service_category.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @service_category = ServiceCategory.find(params[:id])

      respond_to do |format|
        if @service_category.update(service_category_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @service_category.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @service_category = ServiceCategory.find(params[:id])

      respond_to do |format|
        if @service_category.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @service_category.errors, status: :unprocessable_entity }
        end
      end
    end

    private

    def service_category_params
      params.require(:service_category).permit(:id, :name, :french_name, :number, :parent_category_id, :deleted_at, :created_at, :updated_at)
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :showArchived, :filterSearch, :page, :pageSize)
    end

    # Also map the old params to new ransack params till the frontend is adapted
    def search_params
      search = params.fetch(:q, {})
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_false] = true if ["false", false, nil].include?(params[:showArchived])
      search[:id_or_name_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :id_or_name_cont)
    end
  end
end
