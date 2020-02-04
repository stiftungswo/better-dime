# frozen_string_literal: true

require "rails_helper"

RSpec.describe Costgroup, type: :model do
  it { is_expected.to validate_presence_of :number }
  it { is_expected.to validate_presence_of :name }

  describe "#number" do
    subject { create :costgroup }

    it { is_expected.to validate_uniqueness_of :number }
  end

  describe "relations" do
    it "#project_costgroup_distributions" do
      expect(described_class.new).to have_many(:project_costgroup_distributions)
        .dependent(:restrict_with_exception)
    end

    it "#invoice_costgroup_distributions" do
      expect(described_class.new).to have_many(:invoice_costgroup_distributions)
        .dependent(:restrict_with_exception)
    end

    it "#projects" do
      expect(described_class.new).to have_many(:projects)
        .through(:project_costgroup_distributions)
        .dependent(:restrict_with_exception)
    end
  end
end
