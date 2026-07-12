# frozen_string_literal: true

require "rails_helper"

RSpec.describe Location, type: :model do
  it { is_expected.to have_many(:offers).dependent(:restrict_with_exception) }
  it { is_expected.to have_many(:projects).dependent(:restrict_with_exception) }

  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_presence_of :order }
  it { is_expected.to allow_value("Zurich").for(:url) }
  it { is_expected.not_to allow_value("has spaces").for(:url) }
end
