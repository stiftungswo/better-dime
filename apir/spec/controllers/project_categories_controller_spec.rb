# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ProjectCategoriesController, type: :controller do
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
        project_category_a = create(:project_category, name: "Category A")
        project_category_b = create(:project_category, name: "Category B")

        expect(assigns(:project_categories)).to match_array([project_category_a, project_category_b])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:project_category) { create(:project_category, name: "Category A") }

      before do
        get :show, format: :json, params: { id: project_category.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested category" do
        expect(assigns(:project_category)).to eq(project_category)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:project_category) { build(:project_category, name: "Category A") }

      it "returns http success for a valid param" do
        post :create, format: :json, params: { project_category: project_category.as_json }

        expect(response).to have_http_status(:success)
      end

      it "assigns the created category" do
        expect { post :create, format: :json, params: { project_category: project_category.as_json } }.to change(ProjectCategory, :count).by(1)
      end
    end

    describe "#update" do
      let(:project_category) { create(:project_category, name: "Category A") }

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: project_category.id,
            project_category: project_category.as_json.except(:name).merge({ name: "Category X" })
          }

          project_category.reload
        end

        it "returns http success for a valid param" do
          expect(response).to have_http_status(:success)
        end

        it "updates the category" do
          expect(project_category.name).to eq("Category X")
        end
      end
    end

    describe "#destroy" do
      let(:project_category) { create(:project_category, name: "Category A") }

      before do
        # reload before any action so we have it in the database before any action
        project_category.reload
      end

      it "returns sucess" do
        delete :destroy, format: :json, params: { id: project_category.id, project_category: project_category.as_json }

        expect(response).to have_http_status(:success)
      end

      it "deletes the category" do
        expect do
          delete :destroy, format: :json, params: { id: project_category.id, project_category: project_category.as_json }
        end.to change(ProjectCategory, :count).from(1).to(0)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #show" do
      project_category = create(:project_category, name: "Category A")

      get :show, format: :json, params: { id: project_category.id }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #create" do
      project_category = create(:project_category, name: "Category A")

      post :create, format: :json, params: { project_category: project_category.as_json }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #destroy" do
      project_category = create(:project_category, name: "Category A")

      delete :destroy, format: :json, params: { id: project_category.id, project_category: project_category.as_json }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
