# frozen_string_literal: true

require "rails_helper"

RSpec.describe VersionController, type: :controller do
  describe "GET #show" do
    it "reports the build info from the environment" do
      stub_const("ENV", ENV.to_h.merge("GIT_SHA" => "abc123", "GIT_BRANCH" => "develop", "BUILD_TIME" => "2026-11-03T10:00:00Z"))

      get :show

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq("sha" => "abc123", "branch" => "develop", "built_at" => "2026-11-03T10:00:00Z")
    end

    it "does not require authentication" do
      get :show
      expect(response).to have_http_status(:ok)
    end
  end
end
