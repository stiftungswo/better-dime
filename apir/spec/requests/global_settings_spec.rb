# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::GlobalSettings', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/global_settings' do
    it 'returns global settings' do
      create(:global_setting)
      get '/v2/global_settings'
      expect(response).to have_http_status(:ok)
    end
  end
end
