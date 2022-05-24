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

        expect(assigns(:invoices)).to match_array([invoice_a, invoice_b, invoice_c, invoice_d])
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
          address: invoice_template.address,
        )
      end

      before do
        invoice_template.reload
      end

      it "returns unprocessable for an invalid param" do
        expect do
          post :create, format: :json, params: invoice_invalid.as_json
        end.to raise_error(ValidationError)
      end
    end
  end
end
