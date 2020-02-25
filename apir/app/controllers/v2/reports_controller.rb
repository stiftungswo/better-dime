module V2
  class ReportsController < ApplicationController
    def project_report
      from_date = params[:from] || DateTime.new(2019,1,1)
      to_date = params[:to] || DateTime.new(2021,1,1)
      daily_rate = params[:daily_rate] || 1200
      vat = params[:vat] || 0.077

      pdf = Pdfs::ProjectReportPdf.new GlobalSetting.first, Project.find(params[:id]), from_date, to_date, daily_rate, vat

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline"
        end
      end
    end
  end
end
