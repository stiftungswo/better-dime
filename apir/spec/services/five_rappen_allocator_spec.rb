# frozen_string_literal: true

require "rails_helper"

RSpec.describe FiveRappenAllocator do
  it "rounds to multiples of 5 that add up to the target" do
    result = described_class.allocate([33.3, 33.3, 33.4], 100)

    expect(result.sum).to eq(100)
    expect(result).to all(satisfy { |v| (v % 5).zero? })
  end

  it "gives the extra steps to the largest remainders" do
    expect(described_class.allocate([2.0, 2.4, 2.9], 10)).to eq([0, 5, 5])
  end

  it "takes steps away again when the rounded values overshoot" do
    expect(described_class.allocate([10.0, 10.0], 15)).to eq([10, 5])
  end

  it "allocates exact Rappen with a step of 1" do
    expect(described_class.allocate([33.3, 33.3, 33.4], 100, step: 1)).to eq([33, 33, 34])
  end

  it "returns an empty list for no values" do
    expect(described_class.allocate([], 0)).to eq([])
  end
end
