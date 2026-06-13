# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

RSpec.describe 'V2::Holidays', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/holidays' do
    it 'returns a list of holidays' do
      create(:holiday)
      get '/v2/holidays'
      expect(response).to have_http_status(:ok)
    end
  end
end
