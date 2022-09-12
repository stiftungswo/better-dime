# frozen_string_literal: true

require "rails_helper"

RSpec.describe V2::PeopleController, type: :controller do
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

      it "assigns all people" do
        person_a = create(:person, first_name: "person A")
        person_b = create(:person, first_name: "person B")
        person_c = create(:person, first_name: "person C")
        person_d = create(:person, first_name: "person D")

        expect(assigns(:people)).to match_array([person_a, person_b, person_c, person_d])
      end

      it "renders the :index template" do
        expect(response).to render_template :index
      end
    end

    describe "#show" do
      let(:person) { create(:person, first_name: "person A") }

      before do
        get :show, format: :json, params: { id: person.id }
      end

      it "returns http success" do
        expect(response).to have_http_status(:success)
      end

      it "assigns the requested person" do
        expect(assigns(:person)).to eq(person)
      end

      it "renders the :show template" do
        expect(response).to render_template :show
      end
    end

    describe "#create" do
      let(:rate_group) { create(:rate_group) }
      let(:person) { build(:person, first_name: "person A", rate_group: rate_group) }
      let(:person_invalid) { build(:person, first_name: "person I") }

      it "returns http success for a valid param" do
        post :create, format: :json, params: { person: person.as_json }

        expect(response).to have_http_status(:success)
      end

      it "returns unprocessable for an invalid param" do
        # missing rate group
        post :create, format: :json, params: { person: person_invalid.as_json }

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "assigns the created person" do
        expect { post :create, format: :json, params: { person: person.as_json } }.to change(Person, :count).by(1)
      end
    end

    describe "#duplicate" do
      let(:rate_group) { create(:rate_group) }
      let(:person) { create(:person, first_name: "person A", rate_group: rate_group) }

      before do
        person.reload
      end

      it "returns http success for a valid param" do
        expect { post :duplicate, format: :json, params: { id: person.id, person: person.as_json } }.to change(Person, :count).by(1)
      end
    end

    describe "#update" do
      let(:person) { create(:person, first_name: "person A", email: "mail@example.com") }

      describe "with valid params" do
        before do
          put :update, format: :json, params: {
            id: person.id,
            person: person.as_json.except(:email).merge({ email: "newma@sf.fr" })
          }

          person.reload
        end

        it "updates the person" do
          expect(person.email).to eq("newma@sf.fr")
        end
      end

      describe "with invalid params" do
        before do
          put :update, format: :json, params: {
            id: person.id,
            person: person.as_json.except(:email).merge({ email: "A" * 300 })
          }

          person.reload
        end

        it "doesn't update the person" do
          expect(person.email).to eq("mail@example.com")
        end
      end
    end

    describe "#hide" do
      let(:person) { create(:person, hidden: false, first_name: "person A") }

      before do
        put :hide, format: :json, params: {
          id: person.id,
          hidden: true,
          person: person.as_json
        }

        person.reload
      end

      it "returns http success for a valid param" do
        expect(response).to have_http_status(:success)
      end

      it "updates the person's hidden status" do
        expect(person.hidden).to be(true)
      end
    end

    describe "#destroy" do
      let(:person) { create(:person, first_name: "person A") }

      before do
        create(:person, first_name: "person B")
        create(:person, first_name: "person C")
        create(:person, first_name: "person D")

        # reload before any action so we have it in the database before any action
        person.reload
      end

      it "deletes the person" do
        delete :destroy, format: :json, params: { id: person.id, person: person.as_json }

        expect(response).to have_http_status(:success)
      end

      it "deletes the person" do
        expect do
          delete :destroy, format: :json, params: { id: person.id, person: person.as_json }
        end.to change(Person, :count).from(4).to(3)
      end
    end
  end

  describe "with a logged out user" do
    it "returns an authorization error for #index" do
      get :index, format: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #show" do
      person = create(:person, first_name: "person A")

      get :show, format: :json, params: { id: person.id }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #create" do
      person = build(:person, first_name: "person A")

      post :create, format: :json, params: { person: person.as_json }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #hide" do
      person = create(:person, first_name: "person A")

      put :hide, format: :json, params: { id: person.id, person: person.as_json.except(:hidden).merge({ hidden: true }) }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns an authorization error for #destroy" do
      person = create(:person, first_name: "person A")

      delete :destroy, format: :json, params: { id: person.id, person: person.as_json }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
