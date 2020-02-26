# frozen_string_literal: true

module V2
  class ServicesController < ApplicationController
    before_action :set_service, only: [:show, :update, :destroy]

    def index
      @q = Service.includes(:service_rates).order(id: :asc).ransack(search_params)
      @services = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def create
      @service = Service.new(update_params)

      raise ValidationError, @service.errors unless @service.save

      render :show
    end

    def update
      raise ValidationError, @service.errors unless @service.update(update_params)

      render :show
    end

    def duplicate
      @service = Service.find(params[:id]).deep_clone include: [:service_rates]

      raise ValidationError, @service.errors unless @service.save

      render :show
    end

    def destroy
      raise ValidationError, @service.errors unless @service.discard
    end

    private

    def set_service
      @service = Service.find(params[:id])
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
      ParamsModifier.copy_attributes params, :service_rates, :service_rates_attributes

      params.permit(
        :name, :description, :vat, :archived, :order,
        service_rates_attributes: [:id, :rate_group_id, :service_id, :rate_unit_id, :value]
      )
    end
  end
end
