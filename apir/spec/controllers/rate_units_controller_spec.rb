# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::RateUnitsController, type: :controller do
  describe "with a logged in user" do
    before { sign_in create(:employee) }

    describe "#index" do
      it "returns http success" do
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end
    end

    describe "#create" do
      it "creates a rate unit with valid params" do
        expect do
          post :create, format: :json, params: { name: "Days", billing_unit: "CHF/d", effort_unit: "d", factor: 504, is_time: true, archived: false }
        end.to change(RateUnit, :count).by(1)
      end

      it "raises ValidationError with missing params" do
        expect do
          post :create, format: :json, params: { name: "" }
        end.to raise_error(ValidationError)
      end
    end

    describe "#update" do
      let(:rate_unit) { create(:rate_unit) }

      it "updates the rate unit" do
        put :update, format: :json, params: { id: rate_unit.id, name: "Updated" }
        expect(rate_unit.reload.name).to eq("Updated")
      end
    end

    describe "#destroy" do
      let!(:rate_unit) { create(:rate_unit) }

      it "soft-deletes the rate unit" do
        delete :destroy, format: :json, params: { id: rate_unit.id }
        expect(response).to have_http_status(:success)
        expect(rate_unit.reload.discarded?).to be true
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
