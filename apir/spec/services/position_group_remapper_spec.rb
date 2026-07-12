# frozen_string_literal: true

require "rails_helper"

RSpec.describe PositionGroupRemapper do
  describe ".remap_all_groups" do
    it "duplicates all groups and updates positions" do
      group = create(:position_group, name: "Group A", shared: false)
      position = build(:project_position, position_group: group)

      described_class.remap_all_groups([group], [position])

      expect(position.position_group).not_to eq(group)
      expect(position.position_group.name).to eq("Group A")
    end

    it "leaves positions without a matching group unchanged" do
      group_a = create(:position_group, name: "A")
      group_b = create(:position_group, name: "B")
      position = build(:project_position, position_group: group_b)

      described_class.remap_all_groups([group_a], [position])

      expect(position.position_group).to eq(group_b)
    end
  end

  describe ".remap_shared_groups" do
    it "only duplicates shared groups" do
      shared_group = create(:position_group, name: "Shared", shared: true)
      unshared_group = create(:position_group, name: "Unshared", shared: false)
      pos_shared = build(:project_position, position_group: shared_group)
      pos_unshared = build(:project_position, position_group: unshared_group)

      result = described_class.remap_shared_groups([shared_group, unshared_group], [pos_shared, pos_unshared])

      expect(result).to be true
      expect(pos_shared.position_group).not_to eq(shared_group)
      expect(pos_shared.position_group.shared).to be false
      expect(pos_unshared.position_group).to eq(unshared_group)
    end

    it "returns false when no shared groups exist" do
      group = create(:position_group, shared: false)
      position = build(:project_position, position_group: group)

      result = described_class.remap_shared_groups([group], [position])

      expect(result).to be false
    end
  end
end
