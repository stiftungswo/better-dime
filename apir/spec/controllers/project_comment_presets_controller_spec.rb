# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ProjectCommentPresetsController, type: :controller do
  describe "with a logged in user" do
    before { sign_in create(:employee) }

    describe "#index" do
      it "returns http success" do
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end
    end

    describe "#create" do
      it "creates a preset" do
        expect {
          post :create, format: :json, params: { comment_preset: "Weekly update" }
        }.to change(ProjectCommentPreset, :count).by(1)
      end
    end

    describe "#update" do
      let(:preset) { create(:project_comment_preset) }

      it "updates the preset" do
        put :update, format: :json, params: { id: preset.id, comment_preset: "Updated preset" }
        expect(preset.reload.comment_preset).to eq("Updated preset")
      end
    end

    describe "#destroy" do
      let!(:preset) { create(:project_comment_preset) }

      it "soft-deletes the preset" do
        delete :destroy, format: :json, params: { id: preset.id }
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
