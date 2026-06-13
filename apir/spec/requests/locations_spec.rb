# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

RSpec.describe 'V2::Locations', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/locations' do
    it 'returns a list of locations' do
      create(:location)
      get '/v2/locations'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/locations/:id' do
    it 'returns a location' do
      location = create(:location)
      get "/v2/locations/#{location.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
