# frozen_string_literal: true

module V2
  class ServiceHourReportsController < APIController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, except: [:index, :project, :project_category]
    before_action :authenticate_from_params!, only: [:index, :project, :project_category]

    def index
      case report_params["group_by"]
      when "project"
        redirect_to report_params.to_h.merge(action: "project", format: "xlsx")
      when "category"
        redirect_to report_params.to_h.merge(action: "project_category", format: "xlsx")
      end
    end

    def project
      @report = ProjectServiceHourReportService.new(timerange)
    end

    def project_category
      @report = ProjectCategoryServiceHourReportService.new(timerange)
    end

    private

    def timerange
      Date.parse(report_params[:start])..Date.parse(report_params[:end])
    end

    def report_params
      params.permit(:start, :end, :group_by, :token)
    end
  end
end
