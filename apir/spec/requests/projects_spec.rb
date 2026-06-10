# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Projects', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/projects' do
    it 'returns a list of projects' do
      create(:project)
      get '/v2/projects'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/projects/:id' do
    it 'returns a project' do
      location = create(:location)
      project = create(:project, :with_fixed_price, location: location)
      position_group = create(:position_group)
      parent_cat = create(:service_category)
      sub_cat = create(:service_category, parent_category: parent_cat, number: 1)
      service = create(:service, service_category: sub_cat)
      create(:project_position, project: project, position_group: position_group, service: service)
      create(:project_costgroup_distribution, project: project)
      create(:project_category_distribution, project: project)
      create(:invoice, project: project)
      get "/v2/projects/#{project.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
