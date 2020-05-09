# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::EmployeeGroupsController, type: :controller do
  describe "with a logged in user" do
    let(:employee) {create(:employee)}

    before do
      sign_in employee
    end

    describe "#index" do
      before do
        get :index, format: :json
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns all employee groups" do
        employee_group_a = create(:employee_group, name: "Group A")
        employee_group_b = create(:employee_group, name: "Group B")

        expect(assigns(:employee_groups)).to match_array([employee.employee_group, employee_group_a, employee_group_b])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:employee_group) {create(:employee_group, name: "Group A")}

      before do
        get :show, format: :json, params: {id: employee_group.id}
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested employee group" do
        expect(assigns(:employee_group)).to eq(employee_group)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:employee_group) {build(:employee_group, name: "Group A")}

      it "returns http success for a valid param" do
        post :create, format: :json, params: {
          name: employee_group.name,
          employee_group: employee_group.as_json
        }

        expect(response).to have_http_status(:success)
      end

      it "assigns the created group" do
        expect{
          post :create, format: :json, params: {
            name: employee_group.name,
            employee_group: employee_group.as_json
          }
        }.to change(EmployeeGroup, :count).by(1)
      end
    end

    describe "#update" do
      let(:employee_group) {create(:employee_group, name: "Group A")}

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: employee_group.id,
            name: "Group X",
            employee_group: employee_group.as_json.except(:name).merge(name: "Group X")
          }

          employee_group.reload
        end

        it "returns http success for a valid param" do
          expect(response).to have_http_status(:success)
        end

        it "updates the category" do
          expect(employee_group.name).to eq("Group X")
        end
      end
    end

    describe "#destroy" do
      let(:employee_group) {create(:employee_group, name: "Group A")}

      before do
        # reload before any action so we have it in the database before any action
        employee_group.reload
      end

      it "returns success" do
        delete :destroy, format: :json, params: {id: employee_group.id, employee_group: employee_group.as_json}

        expect(response).to have_http_status(:success)
      end

      it "deletes the employee group" do
        # we got 2 initially because we create a employee for authentication => creates an employee group
        expect{
          delete :destroy, format: :json, params: {id: employee_group.id, employee_group: employee_group.as_json}
        }.to change(EmployeeGroup, :count).from(2).to(1)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #show" do
      employee_group = create(:employee_group, name: "Group A")

      get :show, format: :json, params: {id: employee_group.id}

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #create" do
      employee_group = create(:employee_group, name: "Group A")

      post :create, format: :json, params: {employee_group: employee_group.as_json}

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #destroy" do
      employee_group = create(:employee_group, name: "Group A")

      delete :destroy, format: :json, params: {id: employee_group.id, employee_group: employee_group.as_json}

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
