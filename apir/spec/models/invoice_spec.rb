# frozen_string_literal: true

require "rails_helper"

RSpec.describe Invoice, type: :model do
  it { is_expected.to validate_presence_of :accountant }
  it { is_expected.to validate_presence_of :address }
  it { is_expected.to validate_presence_of :description }
  it { is_expected.to validate_presence_of :beginning }
  it { is_expected.to validate_presence_of :ending }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_numericality_of(:fixed_price).only_integer }
  it { is_expected.to validate_numericality_of(:fixed_price_vat).is_greater_than_or_equal_to 0 }

  it_behaves_like "ending is after beginning"

  describe "#beginning" do
    it_behaves_like "only accepts dates", :beginning
  end

  describe "#ending" do
    it_behaves_like "only accepts dates", :ending
  end

  # this applies to all text fields as it is defined in ApplicationRecord
  it "normalizes unicode fields" do
    invoice = Invoice.new
    invoice.description = "a\u0308 o\u0308 u\u0308" # create äöü with the combining diaresis
    invoice.validate
    expect(invoice.description).to eq("ä ö ü")
  end
end
