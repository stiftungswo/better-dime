# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::EmployeesController, type: :controller do
  describe "with a logged in user" do
    before do
      employee = create(:employee)

      sign_in employee
    end

    let(:employee_group) {create(:employee_group)}

    describe "#index" do
      before do
        get :index, format: :json
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns all companies" do
        employee_a = create(:employee, first_name: "Employee A")
        employee_b = create(:employee, first_name: "Employee B")

        expect(assigns(:employees)).to match_array([subject.current_employee, employee_a, employee_b])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:employee) {create(:employee, first_name: "Employee A")}

      before do
        get :show, format: :json, params: {id: employee.id}
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested employee" do
        expect(assigns(:employee)).to eq(employee)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:employee) {build(:employee, first_name: "Employee A", employee_group: employee_group)}
      let(:employee_invalid) {build(:employee, first_name: "Employee I", email: "invalid", employee_group: employee_group)}

      before do
        employee_group.reload
      end

      it "returns http success for a valid param" do
        post :create, format: :json, params: {employee: employee.as_json.merge(password: employee.password)}

        expect(response).to have_http_status(:success)
      end

      it "returns unprocessable for an invalid param" do
        # missing rate group
        post :create, format: :json, params: {employee: employee_invalid.as_json.merge(password: employee.password)}

        expect(response).to have_http_status(422)
      end

      it "assigns the created company" do
        expect{post :create, format: :json, params: {employee: employee.as_json.merge(password: employee.password)}}.to change(Employee, :count).by(1)
      end
    end

    describe "#duplicate" do
      let(:employee) {create(:employee, first_name: "Employee A")}

      before do
        employee.reload
      end

      it "returns http success for a valid param" do
        expect{post :duplicate, format: :json, params: {id: employee.id, employee: employee.as_json}}.to change(Employee, :count).by(1)
      end
    end

    describe "#update" do
      let(:employee) {create(:employee, first_name: "Employee A", email: "myemail@stuff.com")}

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: employee.id,
            employee: employee.as_json.except(:first_name).merge({first_name: "Employee X"})
          }

          employee.reload
        end

        it "returns http success for a valid param" do
          expect(response).to have_http_status(:success)
        end

        it "updates the company" do
          expect(employee.first_name).to eq("Employee X")
        end
      end

      describe "with invalid params" do
        before do
          put :update, format: :json, params: {
            id: employee.id,
            employee: employee.as_json.except(:email).merge({email: "invalid"})
          }

          employee.reload
        end

        it "doesn't update the company" do
          expect(employee.email).to eq("myemail@stuff.com")
        end
      end
    end

    describe "#destroy" do
      let(:employee) {create(:employee, first_name: "Employee A")}

      before do
        create(:employee, first_name: "Employee B")
        create(:employee, first_name: "Employee C")
        create(:employee, first_name: "Employee D")

        # reload before any action so we have it in the database before any action
        employee.reload
      end

      it "returns sucess" do
        delete :destroy, format: :json, params: {id: employee.id, employee: employee.as_json}

        expect(response).to have_http_status(:success)
      end

      it "deletes the employee" do
        # go from 5 to 4 instead of 4 to 3 because we create one employee for authentication already
        expect{
          delete :destroy, format: :json, params: {id: employee.id, employee: employee.as_json}
        }.to change(Employee, :count).from(5).to(4)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #show" do
      employee = create(:employee, first_name: "Employee A")

      get :show, format: :json, params: {id: employee.id}

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #create" do
      employee = build(:employee, first_name: "Employee A")

      post :create, format: :json, params: {employee: employee.as_json}

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #destroy" do
      employee = create(:employee, first_name: "Employee A")

      delete :destroy, format: :json, params: {id: employee.id, employee: employee.as_json}

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
