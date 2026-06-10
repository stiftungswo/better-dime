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
      location = create(:location)
      invoice = create(:invoice, :with_fixed_price, location: location)
      create(:invoice, project: invoice.project)
      position_group = create(:position_group)
      create(:invoice_position, invoice: invoice, position_group: position_group)
      create(:invoice_costgroup_distribution, invoice: invoice)
      create(:invoice_discount, invoice: invoice)
      get "/v2/invoices/#{invoice.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
