# frozen_string_literal: true

module V2
  class RevenueReportsController < APIController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, except: [:index]
    before_action :authenticate_from_params!, only: [:index]

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
