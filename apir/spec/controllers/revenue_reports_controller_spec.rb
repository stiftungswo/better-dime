# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::RevenueReportsController, type: :controller do
  describe "#index without authentication" do
    it "returns unauthorized" do
      get :index, format: :json, params: { from: "2026-01-01", to: "2026-12-31" }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
