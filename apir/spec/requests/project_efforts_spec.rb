# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::ProjectEfforts', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/project_efforts' do
    it 'returns a list of project efforts' do
      create(:project_effort)
      get '/v2/project_efforts'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/project_efforts/:id' do
    it 'returns a project effort' do
      effort = create(:project_effort)
      get "/v2/project_efforts/#{effort.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
