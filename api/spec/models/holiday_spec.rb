# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Holiday, type: :model do
  it { is_expected.to validate_presence_of :duration }
  it { is_expected.to validate_presence_of :date }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_numericality_of(:duration).only_integer.is_greater_than(0) }

  # TODO: add date validation spec
end
