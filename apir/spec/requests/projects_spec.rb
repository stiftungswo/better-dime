# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Projects', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/projects' do
    it 'returns a list of projects' do
      create(:project)
      get '/v2/projects'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/projects/:id' do
    it 'returns a project' do
      project = create(:project)
      get "/v2/projects/#{project.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
