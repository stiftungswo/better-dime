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

    it 'returns a project with nullable fields null' do
      project = create(:project, deadline: nil)
      service = create(:service, service_category: nil)
      create(:project_position, project: project, position_group: nil, service: service)
      get "/v2/projects/#{project.id}"
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /v2/projects' do
    it 'creates a project' do
      employee = create(:employee)
      customer = create(:person)
      address = create(:address, customer: customer)
      rate_group = create(:rate_group)
      service = create(:service)
      rate_unit = create(:rate_unit)
      costgroup = create(:costgroup)
      category = create(:project_category)

      post '/v2/projects', params: {
        accountant_id: employee.id,
        address_id: address.id,
        customer_id: customer.id,
        description: 'My description',
        name: 'My Project',
        rate_group_id: rate_group.id,
        location_id: nil,
        deadline: nil,
        fixed_price: nil,
        archived: false,
        chargeable: false,
        vacation_project: false,
        positions: [{
          description: 'Position',
          order: 1,
          position_group_id: nil,
          price_per_rate: 100,
          rate_unit_id: rate_unit.id,
          service_id: service.id,
          vat: 0.077,
        }],
        costgroup_distributions: [{
          costgroup_number: costgroup.number,
          weight: 100,
        }],
        category_distributions: [{
          category_id: category.id,
          weight: 100,
        }],
        position_groupings: [],
      }, as: :json
      expect(response).to have_http_status(:success)
    end

    it 'creates a project with non-null optional fields' do
      employee = create(:employee)
      customer = create(:person)
      address = create(:address, customer: customer)
      rate_group = create(:rate_group)
      service = create(:service)
      rate_unit = create(:rate_unit)
      location = create(:location)
      position_group = create(:position_group)

      post '/v2/projects', params: {
        accountant_id: employee.id,
        address_id: address.id,
        customer_id: customer.id,
        description: 'My description',
        name: 'My Project',
        rate_group_id: rate_group.id,
        location_id: location.id,
        deadline: '2025-12-31',
        fixed_price: 5000,
        archived: false,
        chargeable: true,
        vacation_project: false,
        positions: [{
          description: 'Position',
          order: 1,
          position_group_id: position_group.id,
          price_per_rate: 100,
          rate_unit_id: rate_unit.id,
          service_id: service.id,
          vat: 0.077,
        }],
        costgroup_distributions: [],
        category_distributions: [],
        position_groupings: [{
          id: position_group.id,
          name: position_group.name,
          order: 1,
          shared: false,
        }],
      }, as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'PUT /v2/projects/:id' do
    it 'updates a project' do
      project = create(:project)
      put "/v2/projects/#{project.id}", params: {
        accountant_id: project.accountant_id,
        address_id: project.address_id,
        customer_id: project.customer_id,
        description: project.description,
        name: 'Updated Project',
        rate_group_id: project.rate_group_id,
        location_id: nil,
        deadline: nil,
        fixed_price: nil,
        archived: false,
        chargeable: false,
        vacation_project: false,
        positions: [],
        costgroup_distributions: [],
        category_distributions: [],
        position_groupings: [],
      }, as: :json
      expect(response).to have_http_status(:success)
    end
  end
end
