# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

RSpec.describe 'V2::EmployeeGroups', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/employee_groups' do
    it 'returns a list of employee groups' do
      create(:employee_group)
      get '/v2/employee_groups'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/employee_groups/:id' do
    it 'returns an employee group' do
      group = create(:employee_group)
      get "/v2/employee_groups/#{group.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
