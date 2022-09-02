# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::CustomerTagsController, type: :controller do
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

      it "assigns all cost groups" do
        customer_tag_a = create(:customer_tag, name: "Tag A")
        customer_tag_b = create(:customer_tag, name: "Tag B")
        customer_tag_c = create(:customer_tag, name: "Tag C")

        expect(assigns(:customer_tags)).to match_array([customer_tag_a, customer_tag_b, customer_tag_c])
      end
    end

    describe "#show" do
      let(:customer_tag) { create(:customer_tag, name: "Tag A") }

      before do
        get :show, format: :json, params: { id: customer_tag.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns all cost groups" do
        expect(assigns(:customer_tag)).to eq(customer_tag)
      end
    end

    describe "#create" do
      let(:customer_tag) { build(:customer_tag, name: "Tag A") }

      it "returns http success for a valid param" do
        post :create, format: :json, params: { customer_tag: customer_tag.as_json }

        expect(response).to have_http_status(:success)
      end

      it "returns unprocessable for an invalid param" do
        existing_tag = create(:customer_tag, name: "Tag A")
        existing_tag.reload

        # cannot create two tags with the same name
        post :create, format: :json, params: { customer_tag: customer_tag.as_json }

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "assigns the created tag" do
        expect { post :create, format: :json, params: { customer_tag: customer_tag.as_json } }.to change(CustomerTag, :count).by(1)
      end
    end

    describe "#update" do
      let(:customer_tag) { create(:customer_tag, name: "Tag A") }

      before do
        customer_tag.reload
      end

      it "returns updates correctly with valid params" do
        put :update, format: :json, params: { id: customer_tag.id, customer_tag: customer_tag.as_json.except(:name).merge({ name: "Tag B" }) }
        customer_tag.reload

        expect(customer_tag.name).to eq("Tag B")
      end

      it "doesn't update with invalid params" do
        customer_tag_b = create(:customer_tag, name: "Tag B")
        customer_tag_b.reload

        put :update, format: :json, params: { id: customer_tag.id, customer_tag: customer_tag.as_json.except(:name).merge({ name: "Tag B" }) }
        customer_tag.reload

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    describe "#archive" do
      let(:customer_tag) { create(:customer_tag, archived: false, name: "Tag A") }

      before do
        customer_tag.reload
      end

      it "archives correctly" do
        put :archive, format: :json, params: { id: customer_tag.id, archived: true, customer_tag: customer_tag.as_json }
        customer_tag.reload

        expect(customer_tag.archived).to be(true)
      end
    end

    describe "#destroy" do
      let(:customer_tag) { create(:customer_tag, name: "Tag A") }

      before do
        customer_tag.reload
      end

      it "destroys the tag" do
        expect do
          delete :destroy, format: :json, params: { id: customer_tag.id, customer_tag: customer_tag.as_json }
        end.to change(CustomerTag, :count).by(-1)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
