# frozen_string_literal: true

module V2
  class EmployeeGroupsController < APIController
    def index
      @q = EmployeeGroup.order(created_at: :desc).ransack(search_params)
      @employee_groups = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    # unused yet
    def show
      @employee_group = EmployeeGroup.find(params[:id]).decorate
    end

    def create
      @employee_group = EmployeeGroup.new(employee_group_params.except(:id))

      respond_to do |format|
        if @employee_group.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee_group.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @employee_group = EmployeeGroup.find(params[:id])

      respond_to do |format|
        if @employee_group.update(employee_group_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee_group.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @employee_group = EmployeeGroup.find(params[:id])

      respond_to do |format|
        if @employee_group.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @employee_group.errors, status: :unprocessable_entity }
        end
      end
    end

    # def archive
    #   @employee_group = EmployeeGroup.find(params[:id])

    #   respond_to do |format|
    #     if @employee_group.update(archived: params[:archived])
    #       format.json { render :show, status: :ok }
    #     else
    #       format.json { render json: @employee_group.errors, status: :unprocessable_entity }
    #     end
    #   end
    # end

    private

    def employee_group_params
      params.require(:employee_group).permit(:id, :name)
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
