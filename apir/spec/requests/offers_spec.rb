# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::Offers', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/offers' do
    it 'returns a list of offers' do
      create(:offer)
      get '/v2/offers'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/offers/:id' do
    it 'returns an offer' do
      location = create(:location)
      offer = create(:offer, :with_fixed_price, location: location)
      project = create(:project, offer: offer)
      create(:invoice, project: project)
      position_group = create(:position_group)
      parent_cat = create(:service_category)
      sub_cat = create(:service_category, parent_category: parent_cat, number: 1)
      service = create(:service, service_category: sub_cat)
      create(:offer_position, offer: offer, position_group: position_group, service: service)
      create(:offer_costgroup_distribution, offer: offer)
      create(:offer_category_distribution, offer: offer)
      create(:offer_discount, offer: offer)
      get "/v2/offers/#{offer.id}"
      expect(response).to have_http_status(:ok)
    end

    it 'returns an offer with nullable fields null' do
      offer = create(:offer)
      service = create(:service, service_category: nil)
      create(:offer_position, offer: offer, position_group: nil, service: service)
      get "/v2/offers/#{offer.id}"
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /v2/offers' do
    it 'creates an offer' do
      employee = create(:employee)
      customer = create(:person)
      address = create(:address, customer: customer)
      rate_group = create(:rate_group)
      service = create(:service)
      rate_unit = create(:rate_unit)
      costgroup = create(:costgroup)
      category = create(:project_category)

      post '/v2/offers', params: {
        accountant_id: employee.id,
        address_id: address.id,
        customer_id: customer.id,
        description: 'My description',
        fixed_price: nil,
        fixed_price_vat: nil,
        location_id: nil,
        name: 'My Offer',
        rate_group_id: rate_group.id,
        short_description: 'Short',
        status: 1,
        positions: [{
          amount: 1,
          description: 'Position',
          order: 1,
          position_group_id: nil,
          price_per_rate: 100,
          rate_unit_id: rate_unit.id,
          rate_unit_archived: false,
          service_id: service.id,
          vat: 0.077,
        }],
        discounts: [{
          name: 'Discount',
          percentage: false,
          value: 10,
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

    it 'creates an offer with non-null optional fields' do
      employee = create(:employee)
      customer = create(:person)
      address = create(:address, customer: customer)
      rate_group = create(:rate_group)
      service = create(:service)
      rate_unit = create(:rate_unit)
      location = create(:location)
      position_group = create(:position_group)

      post '/v2/offers', params: {
        accountant_id: employee.id,
        address_id: address.id,
        customer_id: customer.id,
        description: 'My description',
        fixed_price: 1200,
        fixed_price_vat: 7.7,
        location_id: location.id,
        name: 'My Offer',
        rate_group_id: rate_group.id,
        short_description: 'Short',
        status: 1,
        positions: [{
          amount: 1,
          description: 'Position',
          order: 1,
          position_group_id: position_group.id,
          price_per_rate: 100,
          rate_unit_id: rate_unit.id,
          rate_unit_archived: false,
          service_id: service.id,
          vat: 0.077,
        }],
        discounts: [],
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

  describe 'PUT /v2/offers/:id' do
    it 'updates an offer' do
      offer = create(:offer)
      put "/v2/offers/#{offer.id}", params: {
        accountant_id: offer.accountant_id,
        address_id: offer.address_id,
        customer_id: offer.customer_id,
        description: offer.description,
        fixed_price: nil,
        fixed_price_vat: nil,
        location_id: nil,
        name: 'Updated Offer',
        rate_group_id: offer.rate_group_id,
        short_description: offer.short_description,
        status: offer.status,
        positions: [],
        discounts: [],
        costgroup_distributions: [],
        category_distributions: [],
        position_groupings: [],
      }, as: :json
      expect(response).to have_http_status(:success)
    end
  end
end
