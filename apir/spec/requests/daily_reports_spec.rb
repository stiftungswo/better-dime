# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

RSpec.describe 'V2::DailyReports', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/reports/daily' do
    it 'returns daily report data' do
      effort = create(:project_effort, date: '2024-01-15', employee: employee)
      get '/v2/reports/daily', params: { from: '2024-01-01', to: '2024-01-31' }
      expect(response).to have_http_status(:ok)
    end
  end
end
