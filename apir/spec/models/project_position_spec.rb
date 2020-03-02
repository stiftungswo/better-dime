# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectPosition, type: :model do
  it { is_expected.to belong_to :rate_unit }
  it { is_expected.to belong_to :service }
  it { is_expected.to belong_to :project }
  it { is_expected.to validate_presence_of :price_per_rate }
  it { is_expected.to validate_presence_of :vat }
  it { is_expected.to validate_presence_of :order }
  it { is_expected.to validate_numericality_of(:vat).is_greater_than_or_equal_to(0) }
  it { is_expected.to validate_numericality_of(:order).only_integer }
end
