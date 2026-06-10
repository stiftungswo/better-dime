# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::ProjectComments', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/project_comments' do
    it 'returns a list of project comments' do
      project = create(:project)
      create(:project_comment, project: project)
      get '/v2/project_comments'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/project_comments/:id' do
    it 'returns a project comment' do
      project = create(:project)
      comment = create(:project_comment, project: project)
      get "/v2/project_comments/#{comment.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
