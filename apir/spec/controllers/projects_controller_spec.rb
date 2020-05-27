# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ProjectsController, type: :controller do
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
        project_a = create(:project, name: "Project A")
        project_b = create(:project, name: "Project B")
        project_c = create(:project, name: "Project C")
        project_d = create(:project, name: "Project D")

        expect(assigns(:projects)).to match_array([project_a, project_b, project_c, project_d])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:project) { create(:project, name: "Company A") }

      before do
        get :show, format: :json, params: { id: project.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested project" do
        expect(assigns(:project)).to eq(project)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:project_template) { create(:project, name: "Project T") }
      let(:project) do
        build(
          :project,
          name: "Project A",
          accountant: project_template.accountant,
          customer: project_template.customer,
          address: project_template.address,
          rate_group: project_template.rate_group,
          project_category: project_template.project_category
        )
      end
      let(:project_invalid) do
        build(
          :project,
          name: "Project A",
          accountant: project_template.accountant,
          customer: project_template.customer,
          address: project_template.address,
          rate_group: project_template.rate_group,
          project_category: nil
        )
      end

      before do
        project_template.reload
      end

      it "returns http success for a valid param" do
        post :create, format: :json, params: project.as_json

        expect(response).to have_http_status(:success)
      end

      it "returns unprocessable for an invalid param" do
        expect do
          post :create, format: :json, params: project_invalid.as_json
        end.to raise_error(ValidationError)
      end

      it "assigns the created project" do
        expect { post :create, format: :json, params: project.as_json }.to change(Project, :count).by(1)
      end
    end

    describe "#duplicate" do
      let(:project) { create(:project, name: "Project A") }

      before do
        project.reload
      end

      it "returns http success for a valid param" do
        expect { post :duplicate, format: :json, params: { id: project.id, project: project.as_json } }.to change(Project, :count).by(1)
      end
    end

    describe "#update" do
      let(:project) { create(:project, name: "Project A") }

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: project.id,
            name: "NewProjectName",
            project: project.as_json.except(:name).merge({ name: "NewProjectName" })
          }

          project.reload
        end

        it "returns http success for a valid param" do
          expect(response).to have_http_status(:success)
        end

        it "updates the project" do
          expect(project.name).to eq("NewProjectName")
        end
      end

      describe "with invalid params" do
        it "returns unprocessable" do
          expect do
            put :update, format: :json, params: project.as_json.except(:fixed_price, :name).merge({ name: "Project U", fixed_price: 3.2 })
          end.to raise_error(ValidationError)
        end
      end
    end

    describe "#destroy" do
      let(:project) { create(:project, name: "Project A") }

      before do
        create(:project, name: "Project B")
        create(:project, name: "Project C")
        create(:project, name: "Project D")

        # reload before any action so we have it in the database before any action
        project.reload
      end

      it "deletes the project" do
        delete :destroy, format: :json, params: { id: project.id, project: project.as_json }

        expect(response).to have_http_status(:success)
      end

      it "deletes the project" do
        expect do
          delete :destroy, format: :json, params: { id: project.id, project: project.as_json }
        end.to change(Project, :count).from(4).to(3)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #show" do
      project = create(:project, name: "Project A")

      get :show, format: :json, params: { id: project.id }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #create" do
      project = build(:project, name: "Project A")

      post :create, format: :json, params: { project: project.as_json }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #destroy" do
      project = create(:project, name: "Project A")

      delete :destroy, format: :json, params: { id: project.id, project: project.as_json }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
