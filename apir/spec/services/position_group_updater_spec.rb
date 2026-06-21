# frozen_string_literal: true

require "rails_helper"

RSpec.describe PositionGroupUpdater do
  describe ".update_all" do
    it "updates name and order on non-shared groups" do
      group = create(:position_group, name: "Old", order: 1, shared: false)
      described_class.update_all([{ id: group.id, name: "New", order: 5 }])
      group.reload
      expect(group.name).to eq("New")
      expect(group.order).to eq(5)
    end

    it "does not update shared groups" do
      group = create(:position_group, name: "Shared", order: 1, shared: true)
      described_class.update_all([{ id: group.id, name: "Changed", order: 9 }])
      group.reload
      expect(group.name).to eq("Shared")
      expect(group.order).to eq(1)
    end

    it "handles nil params" do
      expect { described_class.update_all(nil) }.not_to raise_error
    end
  end
end
