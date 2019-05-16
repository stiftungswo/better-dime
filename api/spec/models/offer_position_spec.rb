# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OfferPosition, type: :model, philipp: true do
  it { is_expected.to validate_presence_of :amount }
  it { is_expected.to validate_presence_of :order }
  it { is_expected.to validate_presence_of :rate_unit }
  it { is_expected.to validate_presence_of :service }
  it { is_expected.to validate_presence_of :vat }

  it { is_expected.to validate_numericality_of(:amount).is_greater_than_or_equal_to 0 }
  it { is_expected.to validate_numericality_of(:order).is_greater_than_or_equal_to 0 }
end
