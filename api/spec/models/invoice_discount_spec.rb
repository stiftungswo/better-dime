# frozen_string_literal: true

require 'rails_helper'

RSpec.describe InvoiceDiscount, type: :model, philipp: true do
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :percentage }
  it { is_expected.to validate_presence_of :value }
  it { is_expected.to validate_numericality_of(:value).is_greater_than 0 }
end
