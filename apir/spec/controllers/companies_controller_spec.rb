# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::CompaniesController, type: :controller do
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
        company_a = create(:company, name: "Company A")
        company_b = create(:company, name: "Company B")
        company_c = create(:company, name: "Company C")
        company_d = create(:company, name: "Company D")

        expect(assigns(:companies)).to match_array([company_a, company_b, company_c, company_d])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:company) { create(:company, name: "Company A") }

      before do
        get :show, format: :json, params: { id: company.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested company" do
        expect(assigns(:company)).to eq(company)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:rate_group) { create(:rate_group) }
      let(:company) { build(:company, name: "Company A", rate_group: rate_group) }
      let(:company_invalid) { build(:company, name: "Company I") }

      it "returns http success for a valid param" do
        post :create, format: :json, params: { company: company.as_json }

        expect(response).to have_http_status(:success)
      end

      it "returns unprocessable for an invalid param" do
        # missing rate group
        post :create, format: :json, params: { company: company_invalid.as_json }

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "assigns the created company" do
        expect { post :create, format: :json, params: { company: company.as_json } }.to change(Company, :count).by(1)
      end
    end

    describe "#duplicate" do
      let(:rate_group) { create(:rate_group) }
      let(:company) { create(:company, name: "Company A", rate_group: rate_group) }

      before do
        company.reload
      end

      it "returns http success for a valid param" do
        expect { post :duplicate, format: :json, params: { id: company.id, company: company.as_json } }.to change(Company, :count).by(1)
      end
    end

    describe "#update" do
      let(:company) { create(:company, name: "Company A") }

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: company.id,
            company: company.as_json.except(:name).merge({ name: "MyNewCompanyName" })
          }

          company.reload
        end

        it "returns http success for a valid param" do
          expect(response).to have_http_status(:success)
        end

        it "updates the company" do
          expect(company.name).to eq("MyNewCompanyName")
        end
      end

      describe "with invalid params" do
        before do
          put :update, format: :json, params: {
            id: company.id,
            company: company.as_json.except(:email, :name).merge({ name: "MyNewCompanyName", email: "A" * 300 })
          }

          company.reload
        end

        it "returns unprocessable" do
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it "doesn't update the company" do
          expect(company.name).to eq("Company A")
        end
      end
    end

    describe "#hide" do
      let(:company) { create(:company, name: "Company A") }

      before do
        put :hide, format: :json, params: {
          id: company.id,
          hidden: true,
          company: company.as_json
        }

        company.reload
      end

      it "returns http success for a valid param" do
        expect(response).to have_http_status(:success)
      end

      it "updates the company's hidden status" do
        expect(company.hidden).to be(true)
      end
    end

    describe "#destroy" do
      let(:company) { create(:company, name: "Company A") }

      before do
        create(:company, name: "Company B")
        create(:company, name: "Company C")
        create(:company, name: "Company D")

        # reload before any action so we have it in the database before any action
        company.reload
      end

      it "deletes the company" do
        delete :destroy, format: :json, params: { id: company.id, company: company.as_json }

        expect(response).to have_http_status(:success)
      end

      it "deletes the company" do
        expect do
          delete :destroy, format: :json, params: { id: company.id, company: company.as_json }
        end.to change(Company, :count).from(4).to(3)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #show" do
      company = create(:company, name: "Company A")

      get :show, format: :json, params: { id: company.id }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #create" do
      company = build(:company, name: "Company A")

      post :create, format: :json, params: { company: company.as_json }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #hide" do
      company = create(:company, name: "Company A")

      put :hide, format: :json, params: { id: company.id, company: company.as_json.except(:hidden).merge({ hidden: true }) }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #destroy" do
      company = create(:company, name: "Company A")

      delete :destroy, format: :json, params: { id: company.id, company: company.as_json }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
