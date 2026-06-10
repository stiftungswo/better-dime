# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Customers', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/customers' do
    it 'returns a list of customers' do
      create(:person)
      get '/v2/customers'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/customers/:id' do
    it 'returns a customer' do
      customer = create(:person)
      get "/v2/customers/#{customer.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
