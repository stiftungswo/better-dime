# frozen_string_literal: true

module V2
  class CostGroupReportsController < APIController
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
