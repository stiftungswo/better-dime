# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Services', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/services' do
    it 'returns a list of services' do
      parent = create(:service_category)
      sub = create(:service_category, parent_category: parent, number: 1)
      create(:service, service_category: sub)
      get '/v2/services'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/services/:id' do
    it 'returns a service' do
      parent = create(:service_category)
      sub = create(:service_category, parent_category: parent, number: 1)
      service = create(:service, service_category: sub)
      create(:service_rate, service: service)
      get "/v2/services/#{service.id}"
      expect(response).to have_http_status(:ok)
    end

    it 'returns a service with nullable fields null' do
      service = create(:service, service_category: nil)
      get "/v2/services/#{service.id}"
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /v2/services' do
    it 'creates a service' do
      rate_group = create(:rate_group)
      rate_unit = create(:rate_unit)

      post '/v2/services', params: {
        name: 'My Service',
        description: 'Description',
        vat: 0.077,
        archived: false,
        local_order: 1,
        service_category_id: nil,
        service_rates: [{
          rate_group_id: rate_group.id,
          rate_unit_id: rate_unit.id,
          value: 100,
        }],
      }, as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'PUT /v2/services/:id' do
    it 'updates a service' do
      service = create(:service, service_category: nil)
      put "/v2/services/#{service.id}", params: {
        name: 'Updated Service',
        description: service.description,
        vat: service.vat,
        archived: false,
        local_order: service.local_order,
        service_category_id: nil,
        service_rates: [],
      }, as: :json
      expect(response).to have_http_status(:success)
    end
  end
end
