# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ServiceRate, type: :model do
  it { is_expected.to belong_to :rate_group }
  it { is_expected.to belong_to :service }
  it { is_expected.to belong_to :rate_unit }
  it { is_expected.to validate_presence_of :value }
  it { is_expected.to validate_numericality_of(:value).only_integer.is_greater_than_or_equal_to(0) }
end
