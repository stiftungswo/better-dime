# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Costgroups', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/costgroups' do
    it 'returns a list of costgroups' do
      create(:costgroup)
      get '/v2/costgroups'
      expect(response).to have_http_status(:ok)
    end
  end
end
