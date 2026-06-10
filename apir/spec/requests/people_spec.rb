# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V2::People', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/people' do
    it 'returns a list of people' do
      create(:person)
      get '/v2/people'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/people/:id' do
    it 'returns a person' do
      company = create(:company)
      person = create(:person, company: company, accountant: employee)
      create(:address, customer: person, description: 'c/o Someone')
      Phone.create!(number: '0433555844', category: 1, customer_id: person.id)
      tag = create(:customer_tag)
      person.customer_tags << tag
      get "/v2/people/#{person.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
