# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::LocationsController, type: :controller do
  describe "with a logged in user" do
    before do
      employee = create(:employee)

      sign_in employee
    end

    describe "#index" do
      before do
        get :index, format: :json
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns all locations" do
        location_a = create(:location, name: "Location A", order: 1)
        location_b = create(:location, name: "Location B", order: 2)
        location_c = create(:location, name: "Location C", order: 3)
        location_d = create(:location, name: "Location D", order: 4)

        expect(assigns(:locations)).to match_array([location_a, location_b, location_c, location_d])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:location) { create(:location, name: "Location A", order: 1) }

      before do
        get :show, format: :json, params: { id: location.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested invoice" do
        expect(assigns(:location)).to eq(location)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:location_template) { create(:location, name: "Location T", url: "urlT", order: 1) }
      let(:location) do
        build(
          :location,
          name: "location A",
          url: "URLA",
          order: 42,
        )
      end
      let(:location_invalid) do
        build(
          :location,
          name: "Location A",
          url: "this is invalid!",
          order: 32,
        )
      end

      before do
        location_template.reload
      end

      it "returns http success for a valid param" do
        post :create, format: :json, params: { location: location.as_json }

        expect(response).to have_http_status(:success)
      end

      it "returns unprocessable for an invalid param" do
        post :create, format: :json, params: { location: location_invalid.as_json }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "assigns the created location" do
        expect { post :create, format: :json, params: { location: location.as_json } }.to change(Location, :count).by(1)
      end
    end
  end
end
