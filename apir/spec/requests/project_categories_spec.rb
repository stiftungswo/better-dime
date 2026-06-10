# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::ProjectCategories', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/project_categories' do
    it 'returns a list of project categories' do
      create(:project_category)
      get '/v2/project_categories'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/project_categories/:id' do
    it 'returns a project category' do
      category = create(:project_category)
      get "/v2/project_categories/#{category.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
