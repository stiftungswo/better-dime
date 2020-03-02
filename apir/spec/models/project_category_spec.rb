# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCategory, type: :model do
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to have_many(:projects).dependent :restrict_with_exception }
end
