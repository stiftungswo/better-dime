# frozen_string_literal: true

require "rails_helper"

RSpec.describe OfferDiscount, type: :model do
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :value }

  it { is_expected.to validate_length_of(:name).is_at_most 255 }
  it { is_expected.to validate_numericality_of(:value).is_greater_than 0 }
end
