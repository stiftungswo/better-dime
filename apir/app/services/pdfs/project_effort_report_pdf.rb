require 'prawn'

module Pdfs
  class ProjectEffortReportPdf < EffortReportPdf
    def subtitle
      "Projekt Nr. " + data.id.to_s
    end
  end
end
