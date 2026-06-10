# frozen_string_literal: true

require 'rspec/openapi'

RSpec::OpenAPI.path = Rails.root.join('doc/openapi.yaml').to_s
RSpec::OpenAPI.title = 'Dime API'
RSpec::OpenAPI.servers = [{ url: 'http://localhost:8000' }]
