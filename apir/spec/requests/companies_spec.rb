# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Companies', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/companies' do
    it 'returns a list of companies' do
      create(:company)
      get '/v2/companies'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/companies/:id' do
    it 'returns a company' do
      company = create(:company)
      get "/v2/companies/#{company.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
