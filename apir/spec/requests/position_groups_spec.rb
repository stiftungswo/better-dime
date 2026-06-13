# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

# PositionGroups only exposes a create endpoint; there are no index or show routes.
RSpec.describe 'V2::PositionGroups', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'POST /v2/position_groups' do
    it 'creates a position group' do
      post '/v2/position_groups', params: { name: 'My Group' }, as: :json
      expect(response).to have_http_status(:success)
    end
  end
end
