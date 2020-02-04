# frozen_string_literal: true

require "rails_helper"

RSpec.describe PositionGroup, type: :model do
  it { is_expected.to have_many :offer_positions }
  it { is_expected.to have_many :project_positions }
  it { is_expected.to have_many :invoice_positions }
end
