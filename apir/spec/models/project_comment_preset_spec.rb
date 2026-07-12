# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCommentPreset, type: :model do
  it "includes SoftDeletable" do
    expect(described_class.ancestors).to include(SoftDeletable)
  end
end
