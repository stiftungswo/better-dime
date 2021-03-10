# frozen_string_literal: true

require "rails_helper"

RSpec.describe Employee, type: :model do
  let(:employee_model) { create(:employee) }

  it { is_expected.to belong_to :employee_group }

  it { is_expected.to have_many(:work_periods).dependent(:restrict_with_exception).inverse_of(:employee) }
  it { is_expected.to have_many(:offers).dependent(:restrict_with_exception).inverse_of(:accountant) }
  it { is_expected.to have_many(:invoices).dependent(:restrict_with_exception).inverse_of(:accountant) }
  it { is_expected.to have_many(:project_efforts).dependent(:restrict_with_exception) }
  it { is_expected.to have_many(:projects).dependent(:restrict_with_exception).inverse_of(:accountant) }
  it { is_expected.to have_many(:customers).dependent(:restrict_with_exception).inverse_of(:accountant) }

  it { is_expected.to validate_presence_of :email }
  it { is_expected.to validate_presence_of :first_name }
  it { is_expected.to validate_presence_of :last_name }
  it { is_expected.to validate_numericality_of(:holidays_per_year).allow_nil.is_greater_than_or_equal_to(0) }
  it { is_expected.to validate_numericality_of(:first_vacation_takeover).is_greater_than_or_equal_to(0) }

  it "encrypts the password" do
    expect(employee_model.encrypted_password).to start_with("$2a$").or start_with("$2y$")
  end

  it "can log-in" do
    expect(employee_model.active_for_authentication?).to eq(true)
  end

  it "has a correct full name" do
    expect(employee_model.full_name).to eq("Peter Pan")
  end

  describe "#email" do
    it { is_expected.to allow_value("user@example.com").for(:email) }
    it { is_expected.not_to allow_value("user.example.com").for(:email) }
  end
end
