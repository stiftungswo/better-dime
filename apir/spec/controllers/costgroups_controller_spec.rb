# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::CostgroupsController, type: :controller do
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

      it "assigns all cost groups" do
        costgroup_a = create(:costgroup, number: 100)
        costgroup_b = create(:costgroup, number: 200)
        costgroup_c = create(:costgroup, number: 300)

        expect(assigns(:costgroups)).to match_array([costgroup_a, costgroup_b, costgroup_c])
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
