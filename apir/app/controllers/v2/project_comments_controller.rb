# frozen_string_literal: true

module V2
  class ProjectCommentsController < ApplicationController
    before_action :set_comment, only: [:show, :update, :destroy]
    before_action :authenticate_employee!

    def index
      @comments = ProjectCommentFilter.new(params).filter ProjectComment.all
    end

    def show
      @comment
    end

    def update
      raise ValidationError, @comment.errors unless @comment.update(update_params)

      render :show
    end

    def create
      @comment = ProjectComment.new(update_params)

      raise ValidationError, @comment.errors unless @comment.save

      render :show
    end

    def destroy
      raise ValidationError, @comment.errors unless @comment.discard
    end

    def move
      CommentMover.move params
      
      render plain: "Successfully moved comments"
    end

    private

    def set_comment
      @comment = ProjectComment.find(params[:id])
    end

    def update_params
      params.permit(:date, :comment, :project_id)
    end
  end
end
