# frozen_string_literal: true

require "rails_helper"

RSpec.describe ServiceCategory, type: :model do
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :french_name }
  it { is_expected.to validate_numericality_of(:number).is_greater_than_or_equal_to(0).is_less_than_or_equal_to(99).only_integer }
end
