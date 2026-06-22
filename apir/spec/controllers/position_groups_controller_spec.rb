# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::PositionGroupsController, type: :controller do
  describe "with a logged in user" do
    before { sign_in create(:employee) }

    describe "#create" do
      it "creates a position group" do
        expect do
          post :create, format: :json, params: { name: "New Group" }
        end.to change(PositionGroup, :count).by(1)
      end
    end
  end

  describe "with a logged out user" do
    it "returns unauthorized for #create" do
      post :create, format: :json, params: { name: "Test" }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
