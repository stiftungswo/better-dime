# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::ServiceCategories', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/service_categories' do
    it 'returns a list of service categories' do
      parent = create(:service_category)
      create(:service_category, parent_category: parent, number: 1)
      get '/v2/service_categories'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/service_categories/:id' do
    it 'returns a service category' do
      parent = create(:service_category)
      category = create(:service_category, parent_category: parent, number: 1)
      get "/v2/service_categories/#{category.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
