# frozen_string_literal: true

require "rails_helper"

RSpec.describe Project, type: :model do
  it { is_expected.to validate_presence_of :accountant }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :address }
  it { is_expected.to validate_presence_of :rate_group }
  it { is_expected.to validate_numericality_of(:fixed_price).only_integer }

  it { is_expected.to belong_to(:customer) }
  it { is_expected.to belong_to(:address) }
  it { is_expected.to belong_to(:rate_group) }

  it "does not validate category on archiving" do
    project = create(:project, offer: nil)

    expect(project.should_validate_category?).to eq(true)
  end

  describe "is expected to validate category" do
    before { allow(subject).to receive(:should_validate_category?).and_return(true) }

    it { is_expected.to validate_presence_of :project_category }
  end

  describe "is not expected to validate category" do
    before { allow(subject).to receive(:should_validate_category?).and_return(false) }

    it { is_expected.not_to validate_presence_of :project_category }
  end

  it "belongs to an accountant" do
    expect(described_class.new).to belong_to(:accountant)
      .class_name(Employee.to_s)
      .with_foreign_key("accountant_id")
      .inverse_of(:projects)
  end
end
