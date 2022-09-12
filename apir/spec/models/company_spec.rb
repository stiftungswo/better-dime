# frozen_string_literal: true

require "rails_helper"

RSpec.describe Company, type: :model do
  describe "validations" do
    subject { create(:company) }

    it { is_expected.to validate_presence_of :name }
    it { is_expected.to validate_presence_of :rate_group }
    it { is_expected.to validate_uniqueness_of(:name).case_insensitive }
    it { is_expected.to validate_length_of(:email).is_at_most(255) }

    it "has many people relation" do
      expect(described_class.new).to have_many(:people)
        .class_name("Person")
        .inverse_of(:company)
        .dependent(:restrict_with_exception)
    end
  end
end
