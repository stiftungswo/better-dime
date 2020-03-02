# frozen_string_literal: true

require "rails_helper"

RSpec.describe Service, type: :model do
  it { is_expected.to have_many(:service_rates).dependent :restrict_with_exception }
  it { is_expected.to have_many(:offer_positions).dependent :restrict_with_exception }
  it { is_expected.to have_many(:project_positions).dependent :restrict_with_exception }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :vat }
  it { is_expected.to validate_presence_of :order }
  it { is_expected.to validate_numericality_of(:vat).is_greater_than_or_equal_to(0) }
  it { is_expected.to validate_numericality_of(:order).is_greater_than_or_equal_to(0).only_integer }
end
