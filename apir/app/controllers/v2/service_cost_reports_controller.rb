# frozen_string_literal: true

module V2
  class ServiceCostReportsController < APIController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, except: [:index, :project, :project_category]
    before_action :authenticate_from_params!, only: [:index, :project, :project_category]

    def index
      redirect_to report_params.to_h.merge(action: "project", format: "xlsx")
    end

    def project
      # turn "false" into false, so that  if with_vat ... end  does the right thing
      with_vat = ActiveRecord::Type::Boolean.new.deserialize(report_params[:with_vat])
      @report = ProjectServiceCostReportService.new(timerange, report_params[:services], with_vat)
    end

    private

    def timerange
      Date.parse(report_params[:start])..Date.parse(report_params[:end])
    end

    def report_params
      params.permit(:start, :end, :token, :with_vat, services: [])
    end
  end
end
