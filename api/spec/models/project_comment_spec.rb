# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ProjectComment, type: :model do
  it { is_expected.to validate_presence_of :comment }
  it { is_expected.to validate_presence_of :date }
  it { is_expected.to belong_to :project }

  # TODO: add date validator specs
end
