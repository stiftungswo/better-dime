# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ProjectCostGroupDistribution, type: :model do
  it { is_expected.to validate_presence_of :weight }
  it { is_expected.to belong_to :cost_group }
  it { is_expected.to belong_to :project }
  it { is_expected.to validate_numericality_of(:weight).only_integer.is_greater_than_or_equal_to(0) }
end
