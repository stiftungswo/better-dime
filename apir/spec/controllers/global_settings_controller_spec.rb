# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::GlobalSettingsController, type: :controller do
  describe "with a logged in user" do
    before { sign_in create(:employee) }

    describe "#index" do
      it "returns http success" do
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end
    end

    describe "#update" do
      let!(:setting) { create(:global_setting) }

      it "updates the global setting" do
        put :update, format: :json, params: {
          global_setting: { sender_name: "New Sender" }
        }
        expect(response).to have_http_status(:success)
        expect(setting.reload.sender_name).to eq("New Sender")
      end

      it "returns unprocessable with invalid params" do
        put :update, format: :json, params: {
          global_setting: { sender_name: "" }
        }
        expect(response).to have_http_status(:unprocessable_entity)
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
