# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ServicesController, type: :controller do
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

      it "assigns all services" do
        service_a = create(:service, name: "Service A")
        service_b = create(:service, name: "Service B")

        expect(assigns(:services)).to match_array([service_a, service_b])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:service) { create(:service, name: "Service A") }

      before do
        get :show, format: :json, params: { id: service.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested service" do
        expect(assigns(:service)).to eq(service)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:service) { build(:service, name: "Service A") }

      it "returns http success for a valid param" do
        post :create, format: :json, params: {
          name: service.name,
          vat: service.vat,
          service: service.as_json.merge(name: service.name, vat: service.vat, archived: false)
        }

        expect(response).to have_http_status(:success)
      end

      it "doesn't allow creation with invalid parameter" do
        expect do
          post :create, format: :json, params: {
            name: service.name,
            vat: 3_123_123,
            service: service.as_json.merge(name: service.name, vat: service.vat, archived: false)
          }
        end.to raise_error(ValidationError)
      end

      it "assigns the created company" do
        expect do
          post :create, format: :json, params: {
            name: service.name,
            vat: service.vat,
            service: service.as_json.merge(name: service.name, vat: service.vat, archived: false)
          }
        end.to change(Service, :count).by(1)
      end
    end

    describe "#duplicate" do
      let(:service) { create(:service, name: "Service A") }

      before do
        service.reload
      end

      it "returns http success for a valid param" do
        expect { post :duplicate, format: :json, params: { id: service.id, service: service.as_json } }.to change(Service, :count).by(1)
      end
    end

    describe "#update" do
      let(:service) { create(:service, name: "Service A") }

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: service.id,
            name: "Service X",
            vat: service.vat,
            service: service.as_json
          }

          service.reload
        end

        it "returns http success for a valid param" do
          expect(response).to have_http_status(:success)
        end

        it "updates the category" do
          expect(service.name).to eq("Service X")
        end
      end
    end

    describe "#destroy" do
      let(:service) { create(:service, name: "Service A") }

      before do
        # reload before any action so we have it in the database before any action
        service.reload
      end

      it "returns sucess" do
        delete :destroy, format: :json, params: { id: service.id, service: service.as_json }

        expect(response).to have_http_status(:success)
      end

      it "deletes the category" do
        expect do
          delete :destroy, format: :json, params: { id: service.id, service: service.as_json }
        end.to change(Service, :count).from(1).to(0)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #show" do
      service = create(:service, name: "Service A")

      get :show, format: :json, params: { id: service.id }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #create" do
      service = create(:service, name: "Service A")

      post :create, format: :json, params: { service: service.as_json }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #destroy" do
      service = create(:service, name: "Service A")

      delete :destroy, format: :json, params: { id: service.id, service: service.as_json }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
