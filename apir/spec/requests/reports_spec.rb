# frozen_string_literal: true

require 'rails_helper'

# All reports endpoints return PDF and use token-based authentication.
# They do not produce JSON schema and are excluded from OpenAPI generation.
RSpec.describe 'V2::Reports', type: :request do
end
