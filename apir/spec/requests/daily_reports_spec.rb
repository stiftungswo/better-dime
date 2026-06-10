# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::DailyReports', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/reports/daily' do
    it 'returns daily report data' do
      get '/v2/reports/daily', params: { from: '2024-01-01', to: '2024-01-31' }
      expect(response).to have_http_status(:ok)
    end
  end
end
