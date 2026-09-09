# frozen_string_literal: true

require "rails_helper"

RSpec.describe Pdfs::ProjectEffortReportPdf do
  let(:global_setting) { create(:global_setting) }
  let(:project) { create(:project) }

  # Reproduces the bug reported for project 1624 / invoice 2080: the
  # Aufwandsrapport (effort report) PDF renders a blank page because
  # generating it raises instead of completing. The project positions
  # ("Services" on the project) affected all had a nil description,
  # while positions on projects where the report worked (1621, 1706)
  # had a description filled in.
  it "renders successfully when a project position has no description" do
    position = create(:project_position, project: project, description: nil)
    create(:project_effort, project_position: position)

    pdf = described_class.new(global_setting, project, nil)

    expect { pdf.render }.not_to raise_error
  end
end
