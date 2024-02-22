# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCostgroupDistribution, type: :model do
  it { is_expected.to belong_to :costgroup }
  it { is_expected.to belong_to :project }
end
