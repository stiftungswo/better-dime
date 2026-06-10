# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ReportsController, type: :controller do
  describe "#project_report" do
    let(:employee) { create(:employee) }
    let(:project) { create(:project) }
    let(:pdf_double) { double("ProjectReportPdf", render: "%PDF-1.4 fake", filename: "test") }

    before do
      allow(controller).to receive(:authenticate_from_params!).and_return(true)
      allow(controller).to receive(:current_employee).and_return(employee)
      allow(Pdfs::ProjectReportPdf).to receive(:new).and_return(pdf_double)
      allow(controller).to receive(:send_data)
    end

    def make_request(params = {})
      get :project_report, format: :pdf, params: { id: project.id }.merge(params)
    end

    context "with no employee_ids param" do
      it "passes an empty array to the PDF service" do
        make_request
        expect(Pdfs::ProjectReportPdf).to have_received(:new).with(
          anything, project, anything, anything, anything, [], anything, anything
        )
      end
    end

    context "with a comma-separated employee_ids param" do
      it "parses employee_ids into an array of strings" do
        make_request(employee_ids: "1,2,3")
        expect(Pdfs::ProjectReportPdf).to have_received(:new).with(
          anything, project, anything, anything, anything, ["1", "2", "3"], anything, anything
        )
      end
    end

    context "with a single employee_id" do
      it "wraps it in a single-element array" do
        make_request(employee_ids: "42")
        expect(Pdfs::ProjectReportPdf).to have_received(:new).with(
          anything, project, anything, anything, anything, ["42"], anything, anything
        )
      end
    end
  end
end
