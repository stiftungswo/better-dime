require 'rails_helper'

RSpec.describe Address, type: :model do
  it { is_expected.to validate_presence_of :city }
  it { is_expected.to validate_presence_of :zip }
  it { is_expected.to validate_presence_of :street }
  it { is_expected.to validate_numericality_of(:zip).only_integer.is_greater_than_or_equal_to(1000) }
end
