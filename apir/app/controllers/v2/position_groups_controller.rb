# frozen_string_literal: true

module V2
  class PositionGroupsController < ApplicationController
    def create
      @position_group = PositionGroup.new(update_params)

      raise ValidationError, @position_group.errors unless @position_group.save

      render :show
    end

    private

    def update_params
      params.permit(:name)
    end
  end
end
