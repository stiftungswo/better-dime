# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::InvoicesController, type: :controller do
  describe "with a logged in user" do
    before do
      employee = create(:employee)

      sign_in employee
    end

    describe "#index" do
      before do
        get :index, format: :json
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns all companies" do
        invoice_a = create(:invoice, name: "Invoice A")
        invoice_b = create(:invoice, name: "Invoice B")
        invoice_c = create(:invoice, name: "Invoice C")
        invoice_d = create(:invoice, name: "Invoice D")

        expect(assigns(:invoices)).to contain_exactly(invoice_a, invoice_b, invoice_c, invoice_d)
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:invoice) { create(:invoice, name: "Invoice A") }

      before do
        get :show, format: :json, params: { id: invoice.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested invoice" do
        expect(assigns(:invoice)).to eq(invoice)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:invoice_template) { create(:invoice, name: "Invoice T") }
      let(:project_a) { create(:project, name: "Project A") }
      let(:invoice_invalid) do
        build(
          :invoice,
          name: "Invoice A",
          accountant: nil,
          customer: invoice_template.customer,
          address: invoice_template.address
        )
      end

      before do
        invoice_template.reload
      end

      it "returns unprocessable for an invalid param" do
        post :create, format: :json, params: invoice_invalid.as_json

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body).to include("errors", "human_readable_descriptions")
      end
    end

    describe "#print / #print_qr_bill with check=1" do
      let(:invoice) { create(:invoice) }

      before do
        create(:global_setting)
        # PDF requests authenticate via a JWT in the params; the employee is already signed in above.
        allow(controller).to receive(:authenticate_from_params!)
      end

      it "answers 204 without rendering the PDF once the invoice is printable" do
        create(:invoice_costgroup_distribution, invoice: invoice)
        allow(Pdfs::InvoicePdf).to receive(:new)

        get :print, params: { id: invoice.id, check: 1 }, format: :pdf

        expect(response).to have_http_status(:no_content)
        expect(Pdfs::InvoicePdf).not_to have_received(:new)
      end

      it "returns the validation error when the invoice has no cost groups" do
        get :print, params: { id: invoice.id, check: 1 }, format: :pdf

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body).to include("human_readable_descriptions")
      end

      it "names the missing customer building number for the QR-bill check" do
        create(:invoice_costgroup_distribution, invoice: invoice)
        invoice.address.update!(street_number: nil)

        get :print_qr_bill, params: { id: invoice.id, check: 1 }, format: :pdf

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body["human_readable_descriptions"].join).to include("Kunden")
      end
    end
  end
end
