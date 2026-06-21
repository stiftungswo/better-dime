# frozen_string_literal: true

require "rails_helper"

RSpec.describe EffortMover do
  describe ".move" do
    let(:service) { create(:service) }
    let(:rate_unit) { create(:rate_unit) }
    let(:project_a) { create(:project) }
    let(:project_b) { create(:project) }
    let(:position_a) { create(:project_position, project: project_a, service: service, rate_unit: rate_unit) }

    it "moves efforts to an existing position in the target project" do
      target_position = create(:project_position, project: project_b, service: service, rate_unit: rate_unit)
      effort = create(:project_effort, project_position: position_a)

      described_class.move(effort_ids: effort.id.to_s, project_id: project_b.id)

      expect(effort.reload.project_position).to eq(target_position)
    end

    it "creates a new position when target project has no matching service" do
      effort = create(:project_effort, project_position: position_a)

      expect do
        described_class.move(effort_ids: effort.id.to_s, project_id: project_b.id)
      end.to change { project_b.project_positions.count }.by(1)

      expect(effort.reload.project_position.project).to eq(project_b)
    end

    it "moves to a specific position when position_id is given" do
      target_position = create(:project_position, project: project_b, service: create(:service), rate_unit: rate_unit)
      effort = create(:project_effort, project_position: position_a)

      described_class.move(effort_ids: effort.id.to_s, project_id: project_b.id, position_id: target_position.id)

      expect(effort.reload.position_id).to eq(target_position.id)
    end
  end
end
