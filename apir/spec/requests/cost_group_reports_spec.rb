# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

# CostGroupReports only renders an XLSX view; there is no JSON endpoint.
RSpec.describe 'V2::CostGroupReports', type: :request do
end
