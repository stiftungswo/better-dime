# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::RateUnits', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/rate_units' do
    it 'returns a list of rate units' do
      create(:rate_unit)
      get '/v2/rate_units'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/rate_units/:id' do
    it 'returns a rate unit' do
      rate_unit = create(:rate_unit)
      get "/v2/rate_units/#{rate_unit.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
