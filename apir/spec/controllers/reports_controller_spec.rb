# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ReportsController, type: :controller do
  describe "with a logged out user" do
    it "returns unauthorized for #project_report (json)" do
      get :project_report, format: :json, params: { id: 1 }
      expect(response).to have_http_status(:unauthorized)
    end

    it "returns unauthorized for #employees_project_report (json)" do
      get :employees_project_report, format: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
