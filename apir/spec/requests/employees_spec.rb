# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Employees', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/employees' do
    it 'returns a list of employees' do
      create(:employee)
      get '/v2/employees'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/employees/:id' do
    it 'returns an employee' do
      target = create(:employee)
      get "/v2/employees/#{target.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
