# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::ProjectCommentPresets', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/project_comment_presets' do
    it 'returns a list of project comment presets' do
      create(:project_comment_preset)
      get '/v2/project_comment_presets'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/project_comment_presets/:id' do
    it 'returns a project comment preset' do
      preset = create(:project_comment_preset)
      get "/v2/project_comment_presets/#{preset.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
