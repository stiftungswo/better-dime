# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::RateGroupsController, type: :controller do
  describe "with a logged in user" do
    before { sign_in create(:employee) }

    describe "#index" do
      it "returns http success" do
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end

      it "assigns rate groups" do
        create(:rate_group)
        get :index, format: :json
        expect(assigns(:rate_groups)).not_to be_empty
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
