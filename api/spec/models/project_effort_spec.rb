# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ProjectEffort, type: :model do
  it { is_expected.to belong_to :employee }
  it { is_expected.to belong_to :project_position }
  it { is_expected.to validate_presence_of :date }
  it { is_expected.to validate_presence_of :value }
  it { is_expected.to validate_numericality_of(:value).is_greater_than_or_equal_to(0) }

  # TODO: add date validation spec
end
