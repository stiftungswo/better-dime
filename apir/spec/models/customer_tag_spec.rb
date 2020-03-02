# frozen_string_literal: true

require "rails_helper"

RSpec.describe CustomerTag, type: :model do
  it { is_expected.to have_and_belong_to_many(:customers) }
  it { is_expected.to validate_presence_of :name }
end
