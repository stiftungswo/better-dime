# frozen_string_literal: true

module V2
  class ProjectCategoriesController < APIController
    def index
      @q = ProjectCategory.order(created_at: :desc).ransack(search_params)
      @project_categories = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @project_category = ProjectCategory.find(params[:id]).decorate
    end

    def create
      @project_category = ProjectCategory.new(project_category_params.except(:id))

      respond_to do |format|
        if @project_category.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @project_category.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @project_category = ProjectCategory.find(params[:id])

      respond_to do |format|
        if @project_category.update(project_category_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @project_category.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @project_category = ProjectCategory.find(params[:id])

      respond_to do |format|
        if @project_category.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @project_category.errors, status: :unprocessable_entity }
        end
      end
    end

    # this api could easily be done in #update
    def archive
      @project_category = ProjectCategory.find(params[:id])

      respond_to do |format|
        if @project_category.update(archived: params[:archived])
          format.json { render :show, status: :ok }
        else
          format.json { render json: @project_category.errors, status: :unprocessable_entity }
        end
      end
    end

    private

    def project_category_params
      params.require(:project_category).permit(:id, :archived, :name, :deleted_at, :created_at, :updated_at, :created_by, :updated_by, :deleted_by)
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
