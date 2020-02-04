# frozen_string_literal: true

module V2
  class HolidaysController < ApplicationController
    before_action :set_holiday, only: [:update, :destroy]

    def index
      @q = Holiday.order(id: :desc).ransack(search_params)
      @holidays = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def create
      @holiday = Holiday.new(update_params)

      raise ValidationError, @holiday.errors unless @holiday.save

      render :show
    end

    def update
      raise ValidationError, @holiday.errors unless @holiday.update(update_params)

      render :show
    end

    def duplicate
      @holiday = Holiday.find(params[:id]).deep_clone

      raise ValidationError, @holiday.errors unless @holiday.save

      render :show
    end

    def destroy
      raise ValidationError, @holiday.errors unless @holiday.discard
    end

    private

    def set_holiday
      @holiday = Holiday.find(params[:id])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:name_or_date_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :name_or_date_cont)
    end

    def update_params
      params.permit(:name, :duration, :date)
    end
  end
end
