# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RateUnit, type: :model do
  it { is_expected.to have_many(:service_rates).dependent(:restrict_with_exception) }
  it { is_expected.to have_many(:offer_positions).dependent(:restrict_with_exception) }
  it { is_expected.to have_many(:invoice_positions).dependent(:restrict_with_exception) }
  it { is_expected.to have_many(:project_positions).dependent(:restrict_with_exception) }

  it { is_expected.to validate_presence_of :billing_unit }
  it { is_expected.to validate_presence_of :effort_unit }
  it { is_expected.to validate_presence_of :factor }
  it { is_expected.to validate_presence_of :is_time }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :archived }
  it { is_expected.to validate_numericality_of(:factor).is_greater_than(0) }
end
