# frozen_string_literal: true

module V2
  class CostGroupReportsController < APIController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, except: [:index]
    before_action :authenticate_from_params!, only: [:index]

    def index
      @report = CostGroupReportService.new(timerange, employee_group_name: "SWO Angestellte")
    end

    private

    def timerange
      Date.parse(report_params[:from])..Date.parse(report_params[:to])
    end

    def report_params
      params.permit(:from, :to)
    end
  end
end
