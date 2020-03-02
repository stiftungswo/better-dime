# frozen_string_literal: true

module V2
  class RateUnitsController < ApplicationController
    before_action :set_rate_unit, only: [:show, :update, :destroy]
    before_action :authenticate_employee!

    def index
      @q = RateUnit.order(id: :desc).ransack(search_params)
      @rate_units = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def create
      @rate_unit = RateUnit.new(update_params)

      raise ValidationError, @rate_unit.errors unless @rate_unit.save

      render :show
    end

    def update
      raise ValidationError, @rate_unit.errors unless @rate_unit.update(update_params)

      render :show
    end

    def destroy
      raise ValidationError, @rate_unit.errors unless @rate_unit.discard
    end

    private

    def set_rate_unit
      @rate_unit = RateUnit.find(params[:id])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :showArchived, :filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:archived_false] = true if legacy_params[:showArchived] == "false"
      search[:name_or_billing_unit_or_effort_unit_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :archived_false, :name_or_billing_unit_or_effort_unit_cont)
    end

    def update_params
      params.permit(:name, :billing_unit, :effort_unit, :factor, :is_time, :archived)
    end
  end
end
