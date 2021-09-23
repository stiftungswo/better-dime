# frozen_string_literal: true

require "prawn"

module Pdfs
  class InvoiceEffortReportPdf < EffortReportPdf
    def efforts_holder
      @data_holder.project
    end

    def is_in_range?(date)
      # only list efforts that happened in the time period of this invoice
      date.between?(@data_holder.beginning, @data_holder.ending)
    end

    def effort_date_range(uniq_dates)
      # match the dates specified in the invoice
      # this is mainly relevant if uniq_dates is empty
      [@data_holder.beginning, @data_holder.ending]
    end
  end
end
