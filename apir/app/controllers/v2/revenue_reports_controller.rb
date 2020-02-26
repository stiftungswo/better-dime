module V2
  class RevenueReportsController < APIController
    def index
      @report = RevenueReportService.new(timerange)
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
