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
  end
end
