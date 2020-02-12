module V2
  class ReportsController < ApplicationController
    def show
      pdf = Pdfs::HelloWorldPdf.new GlobalSetting.first, Offer.find(329)

      respond_to do |format|
        format.pdf do
          send_data pdf.render, type: "application/pdf", disposition: "inline"
        end
      end
    end
  end
end
