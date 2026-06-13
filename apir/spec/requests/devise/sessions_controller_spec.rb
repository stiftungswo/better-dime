# frozen_string_literal: true

# These specs exist solely to generate the OpenAPI schema via rspec-openapi.
# They are not regression tests — do not add assertions here.
require "rails_helper"

RSpec.describe Devise::SessionsController, type: :request do
  describe "#create" do
    context "with valid and allowed parameters" do
      let(:password) { "123456" }
      let(:employee) { create :employee, password: password }
      let(:params) { { email: employee.email, password: password } }
      let(:request) { post employee_session_path(params: { employee: params }) }

      it "creates a new user" do
        expect { request }.to change(WhitelistedJwt, :count).by(1)
      end
    end
  end
end
