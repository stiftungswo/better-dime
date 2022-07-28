# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ServiceCategoriesController, type: :controller do
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

      it "assigns all categories" do
        service_category_a = create(:service_category, name: "Category A", french_name: "A", number: 12)
        service_category_b = create(:service_category, name: "Category B", french_name: "B", number: 34)

        expect(assigns(:service_categories)).to match_array([service_category_a, service_category_b])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:service_category) { create(:service_category, name: "Category A", french_name: "A", number: 12) }

      before do
        get :show, format: :json, params: { id: service_category.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested category" do
        expect(assigns(:service_category)).to eq(service_category)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:service_category) { build(:service_category, name: "Category A", french_name: "A", number: 12) }

      it "returns http success for a valid param" do
        post :create, format: :json, params: { service_category: service_category.as_json }

        expect(response).to have_http_status(:success)
      end

      it "assigns the created category" do
        expect { post :create, format: :json, params: { service_category: service_category.as_json } }.to change(ServiceCategory, :count).by(1)
      end
    end

    describe "#update" do
      let(:service_category) { create(:service_category, name: "Category A", french_name: "A", number: 12) }

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: service_category.id,
            service_category: service_category.as_json.except(:name).merge({ name: "Category X" })
          }

          service_category.reload
        end

        it "returns http success for a valid param" do
          expect(response).to have_http_status(:success)
        end

        it "updates the category" do
          expect(service_category.name).to eq("Category X")
        end
      end
    end

    describe "#destroy" do
      let(:service_category) { create(:service_category, name: "Category A", french_name: "A", number: 12) }

      before do
        # reload before any action so we have it in the database before any action
        service_category.reload
      end

      it "returns sucess" do
        delete :destroy, format: :json, params: { id: service_category.id, service_category: service_category.as_json }

        expect(response).to have_http_status(:success)
      end

      it "deletes the category" do
        expect do
          delete :destroy, format: :json, params: { id: service_category.id, service_category: service_category.as_json }
        end.to change(ServiceCategory, :count).from(1).to(0)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #show" do
      service_category = create(:service_category, name: "Category A", french_name: "A", number: 12)

      get :show, format: :json, params: { id: service_category.id }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #create" do
      service_category = create(:service_category, name: "Category A", french_name: "A", number: 12)

      post :create, format: :json, params: { service_category: service_category.as_json }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #destroy" do
      service_category = create(:service_category, name: "Category A", french_name: "A", number: 12)

      delete :destroy, format: :json, params: { id: service_category.id, service_category: service_category.as_json }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
