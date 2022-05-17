# frozen_string_literal: true

module V2
  class LocationsController < APIController
    before_action :authenticate_employee!

    def index
      @q = Location.order(created_at: :desc).ransack(search_params)
      @locations = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def show
      @location = Location.find(params[:id]).decorate
    end

    def create
      @location = Location.new(location_params.except(:id))

      respond_to do |format|
        if @location.save
          format.json { render :show, status: :ok }
        else
          format.json { render json: @location.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      @location = Location.find(params[:id])

      respond_to do |format|
        if @location.update(location_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @location.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @location = Location.find(params[:id])

      respond_to do |format|
        if @location.destroy
          format.json { render :show, status: :ok }
        else
          format.json { render json: @location.errors, status: :unprocessable_entity }
        end
      end
    end

    # this api could easily be done in #update
    def archive
      @location = Location.find(params[:id])

      respond_to do |format|
        if @location.update(archived: params[:archived])
          format.json { render :show, status: :ok }
        else
          format.json { render json: @location.errors, status: :unprocessable_entity }
        end
      end
    end

    private

    def location_params
      params.require(:location).permit(:id, :name, :url, :archived, :order)
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :showArchived, :filterSearch, :page, :pageSize, :format)
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
