# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ProjectEffortsController, type: :controller do
  describe "with a logged in user" do
    let(:employee) { create(:employee) }

    before { sign_in employee }

    describe "#index" do
      it "returns http success" do
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end
    end

    describe "#create" do
      let(:position) { create(:project_position) }
      let(:costgroup) { create(:costgroup) }

      it "creates an effort with valid params" do
        expect do
          post :create, format: :json, params: {
            date: "2026-01-15", value: 120, employee_id: employee.id,
            position_id: position.id, costgroup_number: costgroup.number
          }
        end.to change(ProjectEffort, :count).by(1)
      end

      it "raises ValidationError with invalid params" do
        expect do
          post :create, format: :json, params: { date: "", value: nil, position_id: position.id }
        end.to raise_error(ValidationError)
      end
    end

    describe "#show" do
      let(:effort) { create(:project_effort) }

      it "returns http success" do
        get :show, format: :json, params: { id: effort.id }
        expect(response).to have_http_status(:success)
      end
    end

    describe "#update" do
      let(:effort) { create(:project_effort) }

      it "updates the effort" do
        put :update, format: :json, params: { id: effort.id, value: 240 }
        expect(effort.reload.value).to eq(240)
      end
    end

    describe "#destroy" do
      let!(:effort) { create(:project_effort) }

      it "soft-deletes the effort" do
        delete :destroy, format: :json, params: { id: effort.id }
        expect(response).to have_http_status(:success)
        expect(effort.reload.discarded?).to be true
      end
    end
  end

  describe "with a logged out user" do
    it "returns unauthorized for #index" do
      get :index, format: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
