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
  end
end
