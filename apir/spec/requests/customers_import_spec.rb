# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require 'rails_helper'

# CustomersImport only exposes write endpoints (template, verify, create); there are no index or show routes.
RSpec.describe 'V2::CustomersImport', type: :request do
end
