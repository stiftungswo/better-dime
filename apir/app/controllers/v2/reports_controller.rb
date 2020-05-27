# frozen_string_literal: true

module V2
  class ReportsController < ApplicationController
    include V2::Concerns::ParamsAuthenticatable

    before_action :authenticate_employee!, unless: -> { request.format.pdf? }
    before_action :authenticate_from_params!, if: -> { request.format.pdf? }

    #:nocov:
    def project_report
      from_date = params[:from].blank? ? DateTime.now - 1.month : DateTime.parse(params[:from])
      to_date = params[:to].blank? ? DateTime.now : DateTime.parse(params[:to])
      daily_rate = params[:daily_rate].to_f / 100.0 || 1200
      vat = params[:vat].to_f || 0.077
      exclude_employee_ids = params[:exclude_employee_ids]&.split(",") || []
      additional_cost_names = params[:additional_costs_names]&.split(",") || []
      additional_cost_prices = params[:additional_costs_prices]&.split(",") || []

      pdf = Pdfs::ProjectReportPdf.new(
        GlobalSetting.first,
        Project.find(params[:id]),
        from_date,
        to_date,
        daily_rate,
        vat,
        exclude_employee_ids,
        additional_cost_names,
        additional_cost_prices
      )

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline", filename: pdf.filename + ".pdf"
        end
      end
    end

    def employees_project_report
      from_date = params[:from].blank? ? DateTime.now - 1.month : DateTime.parse(params[:from])
      to_date = params[:to].blank? ? DateTime.now : DateTime.parse(params[:to])

      pdf = Pdfs::EmployeesProjectReportPdf.new GlobalSetting.first, Employee.find(params[:employee_ids].split(",")), from_date, to_date

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline", filename: pdf.filename + ".pdf"
        end
      end
    end
    #:nocov:
  end
end
