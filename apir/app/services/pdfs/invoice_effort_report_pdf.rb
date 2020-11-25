# frozen_string_literal: true

require "prawn"

module Pdfs
  class InvoiceEffortReportPdf < EffortReportPdf
    def efforts_holder
      @data_holder.project
    end

    def subtitle
      "Projekt Nr. " + efforts_holder.id.to_s
    end
  end
end
