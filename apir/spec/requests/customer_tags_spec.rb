# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::CustomerTags', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/customer_tags' do
    it 'returns a list of customer tags' do
      create(:customer_tag)
      get '/v2/customer_tags'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/customer_tags/:id' do
    it 'returns a customer tag' do
      tag = create(:customer_tag)
      get "/v2/customer_tags/#{tag.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
