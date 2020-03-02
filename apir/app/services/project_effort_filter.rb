# frozen_string_literal: true

class ProjectEffortFilter
  def initialize(params)
    @params = params
  end

  def filter(query)
    filter_by_date filter_by_employee_ids filter_by_project_ids filter_by_service_ids query
  end

  private

  def filter_by_date(query)
    start_date = DateTime.parse @params[:start] if @params[:start].present?
    end_date = DateTime.parse @params[:end] if @params[:end].present?

    if @params[:start].blank? && @params[:end].blank?
      query
    elsif @params[:start].blank?
      query.where(date: ProjectEffort.all.minimum(:date)..end_date)
    elsif @params[:end].blank?
      query.where(date: start_date..ProjectEffort.maximum(:date))
    else
      query.where(date: start_date..end_date)
    end
  end

  def filter_by_employee_ids(query)
    if @params[:employee_ids].blank?
      query
    else
      query.where(
        employee_id: @params[:employee_ids].split(",")
      )
    end
  end

  def filter_by_project_ids(query)
    if @params[:project_ids].blank?
      query
    else
      query.where(project_positions: {
                    project_id: @params[:project_ids].split(",")
                  })
    end
  end

  def filter_by_service_ids(query)
    if @params[:service_ids].blank?
      query
    else
      query.where(project_positions: {
                    service_id: @params[:service_ids].split(",")
                  })
    end
  end
end
