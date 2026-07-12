# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ServiceHourReportsController, type: :controller do
  describe "without authentication" do
    it "returns unauthorized for #index" do
      get :index, format: :json, params: { start: "2026-01-01", end: "2026-12-31", group_by: "project" }
      expect(response).to have_http_status(:unauthorized)
    end

    it "returns unauthorized for #project" do
      get :project, format: :json, params: { start: "2026-01-01", end: "2026-12-31" }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
