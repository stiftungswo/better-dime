# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

RSpec.describe 'V2::RateGroups', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/rate_groups' do
    it 'returns a list of rate groups' do
      create(:rate_group)
      get '/v2/rate_groups'
      expect(response).to have_http_status(:ok)
    end
  end
end
