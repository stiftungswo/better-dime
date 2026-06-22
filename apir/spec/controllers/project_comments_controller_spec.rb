# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::ProjectCommentsController, type: :controller do
  describe "with a logged in user" do
    before { sign_in create(:employee) }

    let(:project) { create(:project) }

    describe "#index" do
      it "returns http success" do
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end
    end

    describe "#create" do
      it "creates a comment with valid params" do
        expect do
          post :create, format: :json, params: { comment: "Test comment", date: "2026-01-15", project_id: project.id }
        end.to change(ProjectComment, :count).by(1)
      end

      it "raises ValidationError with invalid params" do
        expect do
          post :create, format: :json, params: { comment: "", date: "", project_id: project.id }
        end.to raise_error(ValidationError)
      end
    end

    describe "#show" do
      let(:comment) { create(:project_comment, project: project) }

      it "returns http success" do
        get :show, format: :json, params: { id: comment.id }
        expect(response).to have_http_status(:success)
      end
    end

    describe "#update" do
      let(:comment) { create(:project_comment, project: project) }

      it "updates the comment" do
        put :update, format: :json, params: { id: comment.id, comment: "Updated" }
        expect(comment.reload.comment).to eq("Updated")
      end
    end

    describe "#destroy" do
      let!(:comment) { create(:project_comment, project: project) }

      it "soft-deletes the comment" do
        delete :destroy, format: :json, params: { id: comment.id }
        expect(response).to have_http_status(:success)
        expect(comment.reload.discarded?).to be true
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
