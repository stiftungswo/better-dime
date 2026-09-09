# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectServiceHourReportServiceSplit do
  subject(:report) { described_class.new(range) }

  let(:range) { Date.new(2026, 1, 1)..Date.new(2026, 12, 31) }
  let(:rate_unit) { create(:rate_unit, is_time: true) }
  let(:service_a) { create(:service, name: "Service A") }
  let(:service_b) { create(:service, name: "Service B") }
  let(:project) { create(:project, name: "Project X") }

  before do
    position_a = create(:project_position, project: project, service: service_a, rate_unit: rate_unit)
    position_b = create(:project_position, project: project, service: service_b, rate_unit: rate_unit)
    create(:project_effort, project_position: position_a, date: Date.new(2026, 3, 10), value: 600)
    create(:project_effort, project_position: position_b, date: Date.new(2026, 3, 10), value: 1200)
  end

  it "lists the services (ordered by name) as header columns" do
    expect(report.header).to eq(["Projekt ID", "Projekt", "Tätigkeitsbereich IDs", "Tätigkeitsbereiche", "Service A", "Service B"])
  end

  it "returns one row per project with the full hours, unsplit, when it has no category" do
    expect(report.rows).to eq([[project.id, "Project X", "", "", 10.0, 20.0]])
  end

  it "returns the full hours, unsplit, when the project has a single category" do
    category = create(:project_category, name: "Cat A")
    create(:project_category_distribution, project: project, project_category: category, weight: 100)

    expect(report.rows).to eq([[project.id, "Project X", category.id.to_s, "Cat A", 10.0, 20.0]])
  end

  it "splits into one row per category, with the hours multiplied by the category's share" do
    cat_a = create(:project_category, name: "Cat A")
    cat_b = create(:project_category, name: "Cat B")
    create(:project_category_distribution, project: project, project_category: cat_a, weight: 30)
    create(:project_category_distribution, project: project, project_category: cat_b, weight: 70)

    expect(report.rows).to eq([
                                [project.id, "Project X", cat_a.id, "Cat A (30%)", 3.0, 6.0],
                                [project.id, "Project X", cat_b.id, "Cat B (70%)", 7.0, 14.0]
                              ])
  end

  it "totals the hours per service across all projects in the footer, matching the pre-split total" do
    cat_a = create(:project_category, name: "Cat A")
    cat_b = create(:project_category, name: "Cat B")
    create(:project_category_distribution, project: project, project_category: cat_a, weight: 30)
    create(:project_category_distribution, project: project, project_category: cat_b, weight: 70)

    expect(report.footer).to eq(["", "", "", "Total", 10.0, 20.0])
  end

  it "labels categories as 0% and splits no hours to them when all weights are zero" do
    cat_a = create(:project_category, name: "Cat A")
    cat_b = create(:project_category, name: "Cat B")
    create(:project_category_distribution, project: project, project_category: cat_a, weight: 0)
    create(:project_category_distribution, project: project, project_category: cat_b, weight: 0)

    expect(report.rows).to eq([
                                [project.id, "Project X", cat_a.id, "Cat A (0%)", 0.0, 0.0],
                                [project.id, "Project X", cat_b.id, "Cat B (0%)", 0.0, 0.0]
                              ])
  end
end
