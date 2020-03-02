# frozen_string_literal: true

class ProjectCommentFilter
  def initialize(params)
    @params = params
  end

  def filter(query)
    filter_by_date filter_by_project_ids query
  end

  private

  def filter_by_date(query)
    start_date = DateTime.parse @params[:start] if @params[:start].present?
    end_date = DateTime.parse @params[:end] if @params[:end].present?

    if @params[:start].blank? && @params[:end].blank?
      query
    elsif @params[:start].blank?
      query.where(date: ProjectComment.all.minimum(:date)..end_date)
    elsif @params[:end].blank?
      query.where(date: start_date..ProjectComment.maximum(:date))
    else
      query.where(date: start_date..end_date)
    end
  end

  def filter_by_project_ids(query)
    if @params[:project_ids].blank?
      query
    else
      query.where(project_id: @params[:project_ids].split(","))
    end
  end
end
