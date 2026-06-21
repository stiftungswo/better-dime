# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::HolidaysController, type: :controller do
  describe "with a logged in user" do
    before { sign_in create(:employee) }

    describe "#index" do
      it "returns http success" do
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end
    end

    describe "#create" do
      it "creates a holiday with valid params" do
        expect {
          post :create, format: :json, params: { name: "Christmas", date: "2026-12-25", duration: 504 }
        }.to change(Holiday, :count).by(1)
      end

      it "raises ValidationError with invalid params" do
        expect {
          post :create, format: :json, params: { name: "", date: "", duration: nil }
        }.to raise_error(ValidationError)
      end
    end

    describe "#update" do
      let(:holiday) { create(:holiday) }

      it "updates the holiday" do
        put :update, format: :json, params: { id: holiday.id, name: "Updated Holiday" }
        expect(holiday.reload.name).to eq("Updated Holiday")
      end
    end

    describe "#duplicate" do
      let!(:holiday) { create(:holiday) }

      it "duplicates the holiday" do
        expect {
          post :duplicate, format: :json, params: { id: holiday.id }
        }.to change(Holiday, :count).by(1)
      end
    end

    describe "#destroy" do
      let!(:holiday) { create(:holiday) }

      it "soft-deletes the holiday" do
        delete :destroy, format: :json, params: { id: holiday.id }
        expect(response).to have_http_status(:success)
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
