# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Employee, type: :model do
  it { is_expected.to belong_to :employee_group }

  it { is_expected.to have_many(:work_periods).dependent(:restrict_with_exception).inverse_of(:employee) }
  it { is_expected.to have_many(:offers).dependent(:restrict_with_exception).inverse_of(:accountant) }
  it { is_expected.to have_many(:invoices).dependent(:restrict_with_exception).inverse_of(:accountant) }
  it { is_expected.to have_many(:project_efforts).dependent(:restrict_with_exception) }
  it { is_expected.to have_many(:projects).dependent(:restrict_with_exception).inverse_of(:accountant) }

  it { is_expected.to validate_presence_of :email }
  it { is_expected.to validate_presence_of :first_name }
  it { is_expected.to validate_presence_of :last_name }
  it { is_expected.to validate_numericality_of(:holidays_per_year).only_integer.is_greater_than_or_equal_to(0) }

  describe '#email' do
    it { is_expected.to allow_value('user@example.com').for(:email) }
    it { is_expected.not_to allow_value('user.example.com').for(:email) }
  end
end
