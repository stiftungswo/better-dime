# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

# ServiceCostReports uses token-based (params) authentication and returns XLSX.
# TODO: add JWT token helper and write specs once token generation is in place.
RSpec.describe 'V2::ServiceCostReports', type: :request do
end
