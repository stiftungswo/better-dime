# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

RSpec.describe 'V2::Customers', type: :request do
  let(:employee) { create(:employee) }

  before { sign_in employee }

  describe 'GET /v2/customers' do
    it 'returns a list of customers' do
      create(:person)
      get '/v2/customers'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /v2/customers/:id' do
    it 'returns a customer' do
      company = create(:company)
      customer = create(:person, company: company, accountant: employee)
      create(:address, customer: customer, description: 'c/o Someone')
      Phone.create!(number: '0433555844', category: 1, customer_id: customer.id)
      tag = create(:customer_tag)
      customer.customer_tags << tag
      get "/v2/customers/#{customer.id}"
      expect(response).to have_http_status(:ok)
    end
  end
end
