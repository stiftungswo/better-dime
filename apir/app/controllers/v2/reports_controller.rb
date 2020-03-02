# frozen_string_literal: true

module V2
  class ReportsController < ApplicationController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, unless: -> { request.format.pdf? }
    before_action :authenticate_from_params!, if: -> { request.format.pdf? }

    def project_report
      from_date = params[:from].blank? ? DateTime.now() - 1.month : DateTime.parse(params[:from])
      to_date = params[:to].blank? ? DateTime.now() : DateTime.parse(params[:to])
      daily_rate = params[:daily_rate].to_f / 100.0 || 1200
      vat = params[:vat].to_f || 0.077

      pdf = Pdfs::ProjectReportPdf.new GlobalSetting.first, Project.find(params[:id]), from_date, to_date, daily_rate, vat

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline"
        end
      end
    end

    def employee_report
      from_date = params[:from].blank? ? DateTime.now() - 1.month : DateTime.parse(params[:from])
      to_date = params[:to].blank? ? DateTime.now() : DateTime.parse(params[:to])

      pdf = Pdfs::EmployeeReport.new GlobalSetting.first, Project.find(params[:id]), from_date, to_date, daily_rate, vat

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline"
        end
      end
    end
  end
end
