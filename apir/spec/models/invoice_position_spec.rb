# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvoicePosition, type: :model do
  it { is_expected.to validate_presence_of :amount }
  it { is_expected.to validate_presence_of :description }
  it { is_expected.to validate_presence_of :price_per_rate }
  it { is_expected.to validate_presence_of :vat }
  it { is_expected.to validate_presence_of :invoice }
  it { is_expected.to validate_presence_of :rate_unit }

  it { is_expected.to validate_numericality_of(:amount).is_greater_than_or_equal_to 0 }
  it { is_expected.to validate_numericality_of(:order).is_greater_than_or_equal_to 0 }
end
