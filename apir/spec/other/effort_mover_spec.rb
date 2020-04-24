# frozen_string_literal: true

require "rails_helper"

RSpec.describe EffortMover do
  it "moves an effort without position target" do
    project = create(:project)

    effort_a = create(:project_effort, value: 534.23, date: "2019-05-14")
    effort_b = create(:project_effort, value: 31.555, date: "2019-07-13")

    # double check that the created efforts belong to a different project than the one
    # where we are about to move them
    expect(effort_a.project_position.project).not_to eq(project)
    expect(effort_b.project_position.project).not_to eq(project)

    move_request = {
      effort_ids: [effort_a.id, effort_b.id],
      project_id: project.id
    }

    EffortMover.move(move_request)

    expect(project.project_efforts.length).to eq(2)

    project.project_efforts.each do |effort|
      expect(effort.value).to eq(effort_a.value).or eq(effort_b.value)
      expect(effort.date).to eq(effort_a.date).or eq(effort_b.date)
      expect(effort.employee).to eq(effort_a.employee).or eq(effort_b.employee)
      expect(effort.project_position.service).to eq(effort_a.project_position.service).or eq(effort_b.project_position.service)
      expect(effort.project_position.rate_unit).to eq(effort_a.project_position.rate_unit).or eq(effort_b.project_position.rate_unit)
      expect(effort.project_position.price_per_rate).to eq(effort_a.project_position.price_per_rate).or eq(effort_b.project_position.price_per_rate)
      expect(effort.project_position.vat).to eq(effort_a.project_position.vat).or eq(effort_b.project_position.vat)
    end
  end

  it "moves an effort with position target" do
    project = create(:project)

    effort_a = create(:project_effort, value: 534.23, date: "2019-05-14")
    effort_b = create(:project_effort, value: 31.555, date: "2019-07-13")

    existing_position = create(:project_position, project: project)

    # double check that the created efforts belong to a different project than the one
    # where we are about to move them
    expect(effort_a.project_position.project).not_to eq(project)
    expect(effort_b.project_position.project).not_to eq(project)

    move_request = {
      effort_ids: [effort_a.id, effort_b.id],
      project_id: project.id,
      position_id: existing_position.id
    }

    EffortMover.move(move_request)

    expect(project.project_efforts.length).to eq(2)

    project.project_efforts.each do |effort|
      expect(effort.value).to eq(effort_a.value).or eq(effort_b.value)
      expect(effort.date).to eq(effort_a.date).or eq(effort_b.date)
      expect(effort.employee).to eq(effort_a.employee).or eq(effort_b.employee)
      expect(effort.project_position).to eq(existing_position)
    end
  end
end
