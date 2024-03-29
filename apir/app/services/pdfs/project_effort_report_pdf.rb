# frozen_string_literal: true

require "prawn"

module Pdfs
  class ProjectEffortReportPdf < EffortReportPdf
    def subtitle
      "#{I18n.t(:project)} Nr. #{efforts_holder.id}"
    end
  end
end
