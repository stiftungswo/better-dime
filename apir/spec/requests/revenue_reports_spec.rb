# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

# RevenueReports uses token-based (params) authentication for all actions.
# TODO: add JWT token helper and write index spec once token generation is in place.
RSpec.describe 'V2::RevenueReports', type: :request do
end
