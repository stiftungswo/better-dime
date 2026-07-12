# frozen_string_literal: true

require "rails_helper"

RSpec.describe ParamsModifier do
  describe ".copy_attributes" do
    it "copies a value from one key to another" do
      params = { source: "value", other: "keep" }
      described_class.copy_attributes(params, :source, :target)
      expect(params[:target]).to eq("value")
      expect(params[:source]).to eq("value")
    end
  end

  describe ".destroy_missing" do
    let(:existing_a) { double(id: 1) }
    let(:existing_b) { double(id: 2) }
    let(:existing_c) { double(id: 3) }
    let(:collection) { [existing_a, existing_b, existing_c] }

    it "marks items not present in params for destruction" do
      params = { items: [{ id: 1 }] }
      described_class.destroy_missing(params, collection, :items)
      expect(params[:items]).to contain_exactly(
        { id: 1 },
        { id: 2, _destroy: 1 },
        { id: 3, _destroy: 1 }
      )
    end

    it "does nothing when all items are present" do
      params = { items: [{ id: 1 }, { id: 2 }, { id: 3 }] }
      described_class.destroy_missing(params, collection, :items)
      expect(params[:items]).to contain_exactly({ id: 1 }, { id: 2 }, { id: 3 })
    end

    it "marks all items for destruction when params has empty array" do
      params = { items: [] }
      described_class.destroy_missing(params, collection, :items)
      expect(params[:items].length).to eq(3)
      expect(params[:items]).to all(include(_destroy: 1))
    end

    it "does nothing when param key is missing" do
      params = { other: "value" }
      described_class.destroy_missing(params, collection, :items)
      expect(params).to eq(other: "value")
    end
  end
end
