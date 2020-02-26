# frozen_string_literal: true

module V2
  class ReportsController < ApplicationController
    def project_report
      from_date = DateTime.parse(params[:from]) || DateTime.new(2019, 1, 1)
      to_date = DateTime.parse(params[:to]) || DateTime.new(2021, 1, 1)
      daily_rate = params[:daily_rate].to_f / 100.0 || 1200
      vat = params[:vat].to_f || 0.077

      pdf = Pdfs::ProjectReportPdf.new GlobalSetting.first, Project.find(params[:id]), from_date, to_date, daily_rate, vat

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline"
        end
      end
    end
  end
end
