# frozen_string_literal: true

require "rails_helper"

RSpec.describe Offer, type: :model do
  it { is_expected.to validate_presence_of :accountant }
  it { is_expected.to validate_presence_of :customer }
  it { is_expected.to validate_presence_of :address }
  it { is_expected.to validate_presence_of :description }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :rate_group }
  it { is_expected.to validate_presence_of :short_description }
  it { is_expected.to validate_presence_of :status }

  it { is_expected.to validate_length_of(:name).is_at_most 255 }
end
