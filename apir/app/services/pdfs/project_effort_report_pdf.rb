require 'prawn'

module Pdfs
  class ProjectEffortReportPdf < EffortReportPdf
    def subtitle
      "Projekt Nr. " + efforts_holder.id.to_s
    end
  end
end
