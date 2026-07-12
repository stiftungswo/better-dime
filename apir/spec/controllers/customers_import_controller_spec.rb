# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::CustomersImportController, type: :controller do
  describe "with a logged in user" do
    before { sign_in create(:employee) }

    describe "#create" do
      it "imports no customers with empty array" do
        post :create, format: :json, params: { customers_to_import: [] }
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "#template" do
    it "requires token param for xlsx format" do
      expect do
        get :template, format: :xlsx
      end.to raise_error(ActionController::ParameterMissing)
    end
  end
end
