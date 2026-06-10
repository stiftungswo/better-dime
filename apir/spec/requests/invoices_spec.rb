# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Invoices', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/invoices' do
    it 'returns a list of invoices' do
      create(:invoice)
      get '/v2/invoices'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/invoices/:id' do
    it 'returns an invoice' do
      invoice = create(:invoice)
      get "/v2/invoices/#{invoice.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
