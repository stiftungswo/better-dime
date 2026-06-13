# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

# All reports endpoints return PDF and use token-based authentication.
# They do not produce JSON schema and are excluded from OpenAPI generation.
RSpec.describe 'V2::Reports', type: :request do
end
