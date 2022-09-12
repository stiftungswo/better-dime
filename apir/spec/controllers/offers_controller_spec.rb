# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::OffersController, type: :controller do
  # most of this is based on the offers_controller_spec.rb
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

      it "assigns all companies" do
        offer_a = create(:offer, name: "Offer A")
        offer_b = create(:offer, name: "Offer B")
        offer_c = create(:offer, name: "Offer C")
        offer_d = create(:offer, name: "Offer D")

        expect(assigns(:offers)).to match_array([offer_a, offer_b, offer_c, offer_d])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:offer) { create(:offer, name: "Company A") }

      before do
        get :show, format: :json, params: { id: offer.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested offer" do
        expect(assigns(:offer)).to eq(offer)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:offer_template) { create(:offer, name: "offer T") }
      let(:offer) do
        build(
          :offer,
          name: "offer A",
          accountant: offer_template.accountant,
          customer: offer_template.customer,
          address: offer_template.address,
          rate_group: offer_template.rate_group
        )
      end
      let(:offer_invalid) do
        build(
          :offer,
          name: "offer A",
          accountant: nil,
          customer: offer_template.customer,
          address: offer_template.address,
          rate_group: offer_template.rate_group
        )
      end

      before do
        offer_template.reload
      end

      it "returns http success for a valid param" do
        post :create, format: :json, params: offer.as_json

        expect(response).to have_http_status(:success)
      end

      it "returns unprocessable for an invalid param" do
        expect do
          post :create, format: :json, params: offer_invalid.as_json
        end.to raise_error(ValidationError)
      end

      it "assigns the created offer" do
        expect { post :create, format: :json, params: offer.as_json }.to change(Offer, :count).by(1)
      end
    end

    describe "#duplicate" do
      let(:offer) { create(:offer, name: "Offer A") }

      before do
        offer.reload
      end

      it "returns http success for a valid param" do
        expect { post :duplicate, format: :json, params: { id: offer.id, offer: offer.as_json } }.to change(Offer, :count).by(1)
      end
    end

    describe "#update" do
      let(:offer) { create(:offer, name: "Offer A") }

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: offer.id,
            name: "NewOfferName",
            offer: offer.as_json.except(:name).merge({ name: "NewOfferName" })
          }

          offer.reload
        end

        it "returns http success for a valid param" do
          expect(response).to have_http_status(:success)
        end

        it "updates the offer" do
          expect(offer.name).to eq("NewOfferName")
        end
      end

      describe "with invalid params" do
        it "returns unprocessable" do
          expect do
            put :update, format: :json, params: offer.as_json.except(:fixed_price, :name).merge({ name: "Offer U", fixed_price: 3.2 })
          end.to raise_error(ValidationError)
        end
      end
    end

    describe "#destroy" do
      let(:offer) { create(:offer, name: "Offer A") }

      before do
        create(:offer, name: "Offer B")
        create(:offer, name: "Offer C")
        create(:offer, name: "Offer D")

        # reload before any action so we have it in the database before any action
        offer.reload
      end

      it "deletes the offer" do
        delete :destroy, format: :json, params: { id: offer.id, offer: offer.as_json }

        expect(response).to have_http_status(:success)
      end

      it "deletes the offer" do
        expect do
          delete :destroy, format: :json, params: { id: offer.id, offer: offer.as_json }
        end.to change(Offer, :count).from(4).to(3)
      end
    end
  end
end
