# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

RSpec.describe 'V2::Invoices', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/invoices' do
    it 'returns a list of invoices' do
      create(:invoice)
      get '/v2/invoices'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/invoices/:id' do
    it 'returns an invoice' do
      location = create(:location)
      invoice = create(:invoice, :with_fixed_price, location: location)
      create(:invoice, project: invoice.project)
      position_group = create(:position_group)
      create(:invoice_position, invoice: invoice, position_group: position_group)
      create(:invoice_costgroup_distribution, invoice: invoice)
      create(:invoice_discount, invoice: invoice)
      get "/v2/invoices/#{invoice.id}"
      expect(response).to have_http_status(:ok)
    end

    it 'returns an invoice with nullable fields null' do
      invoice = create(:invoice)
      create(:invoice_position, invoice: invoice, position_group: nil)
      get "/v2/invoices/#{invoice.id}"
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /v2/invoices' do
    it 'creates an invoice' do
      employee = create(:employee)
      customer = create(:person)
      address = create(:address, customer: customer)
      project = create(:project, accountant: employee, customer: customer, address: address)
      rate_unit = create(:rate_unit)
      costgroup = create(:costgroup)

      post '/v2/invoices', params: {
        accountant_id: employee.id,
        address_id: address.id,
        customer_id: customer.id,
        project_id: project.id,
        description: 'My description',
        name: 'My Invoice',
        beginning: '2024-01-01',
        ending: '2024-01-31',
        fixed_price: nil,
        fixed_price_vat: nil,
        location_id: nil,
        positions: [{
          amount: 1,
          description: 'Position',
          order: 1,
          position_group_id: nil,
          price_per_rate: 100,
          rate_unit_id: rate_unit.id,
          rate_unit_archived: false,
          vat: 0.077,
        }],
        costgroup_distributions: [{
          costgroup_number: costgroup.number,
          weight: 100,
        }],
        discounts: [{
          name: 'Discount',
          percentage: false,
          value: 10,
        }],
        position_groupings: [],
      }, as: :json
      expect(response).to have_http_status(:success)
    end

    it 'creates an invoice with non-null optional fields' do
      employee = create(:employee)
      customer = create(:person)
      address = create(:address, customer: customer)
      project = create(:project, accountant: employee, customer: customer, address: address)
      rate_unit = create(:rate_unit)
      location = create(:location)
      position_group = create(:position_group)

      post '/v2/invoices', params: {
        accountant_id: employee.id,
        address_id: address.id,
        customer_id: customer.id,
        project_id: project.id,
        description: 'My description',
        name: 'My Invoice',
        beginning: '2024-01-01',
        ending: '2024-01-31',
        fixed_price: 1200,
        fixed_price_vat: 7.7,
        location_id: location.id,
        positions: [{
          amount: 1,
          description: 'Position',
          order: 1,
          position_group_id: position_group.id,
          price_per_rate: 100,
          rate_unit_id: rate_unit.id,
          rate_unit_archived: false,
          vat: 0.077,
        }],
        costgroup_distributions: [],
        discounts: [],
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

  describe 'PUT /v2/invoices/:id' do
    it 'updates an invoice' do
      invoice = create(:invoice)
      put "/v2/invoices/#{invoice.id}", params: {
        accountant_id: invoice.accountant_id,
        address_id: invoice.address_id,
        customer_id: invoice.customer_id,
        description: invoice.description,
        name: 'Updated Invoice',
        beginning: invoice.beginning,
        ending: invoice.ending,
        fixed_price: nil,
        fixed_price_vat: nil,
        location_id: nil,
        positions: [],
        costgroup_distributions: [],
        discounts: [],
        position_groupings: [],
      }, as: :json
      expect(response).to have_http_status(:success)
    end
  end
end
