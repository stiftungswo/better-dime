# frozen_string_literal: true

module V2
  class ProjectCommentPresetsController < ApplicationController
    before_action :set_preset, only: [:show, :update, :destroy]
    before_action :authenticate_employee!

    def index
      @q = ProjectCommentPreset.order(id: :desc).ransack(search_params)
      @presets = @q.result.page(legacy_params[:page]).per(legacy_params[:pageSize])
    end

    def create
      @preset = ProjectCommentPreset.new(update_params)

      raise ValidationError, @preset.errors unless @preset.save

      render :show
    end

    def update
      raise ValidationError, @preset.errors unless @preset.update(update_params)

      render :show
    end

    def destroy
      raise ValidationError, @preset.errors unless @preset.discard
    end

    private

    def set_preset
      @preset = ProjectCommentPreset.find(params[:id])
    end

    def legacy_params
      params.permit(:orderByTag, :orderByDir, :filterSearch, :page, :pageSize)
    end

    def search_params
      search = params.fetch(:q, {}).permit!
      search[:s] ||= "#{legacy_params[:orderByTag]} #{legacy_params[:orderByDir]}"
      search[:comment_preset_cont] ||= legacy_params[:filterSearch]
      search.permit(:s, :comment_preset_cont)
    end

    def update_params
      params.permit(:comment_preset)
    end
  end
end
