# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Offers', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/offers' do
    it 'returns a list of offers' do
      create(:offer)
      get '/v2/offers'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/offers/:id' do
    it 'returns an offer' do
      offer = create(:offer)
      get "/v2/offers/#{offer.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
