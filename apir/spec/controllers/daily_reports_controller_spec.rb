# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::DailyReportsController, type: :controller do
  describe "with a logged in user" do
    before do
      employee = create(:employee)

      sign_in employee
    end

    describe "#index" do
      before do
        get :index, format: :json, params: { from: "2019-05-14", to: "2019-07-19" }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
