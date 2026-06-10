# frozen_string_literal: true

require "rails_helper"

RSpec.describe Pdfs::ProjectReportPdf do
  let(:project) { create(:project) }
  let(:employee1) { create(:employee) }
  let(:employee2) { create(:employee) }
  let(:position) { create(:project_position, project: project) }

  let(:from_date) { Date.new(2024, 1, 1) }
  let(:to_date) { Date.new(2024, 1, 31) }
  let(:in_range_date) { Date.new(2024, 1, 15) }
  let(:out_of_range_date) { Date.new(2024, 3, 1) }

  let(:effort_in_range_emp1) { create(:project_effort, project_position: position, employee: employee1, date: in_range_date) }
  let(:effort_in_range_emp2) { create(:project_effort, project_position: position, employee: employee2, date: in_range_date) }
  let(:effort_out_of_range) { create(:project_effort, project_position: position, employee: employee1, date: out_of_range_date) }

  # Stub BasePdf#initialize so Prawn document/draw never runs.
  # ProjectReportPdf#initialize still runs (setting all ivars) before calling super().
  def build_service(employee_ids, start_date = from_date, end_date = to_date)
    allow_any_instance_of(Pdfs::BasePdf).to receive(:initialize)
    described_class.new(nil, project, start_date, end_date, 0.077, employee_ids, [], [])
  end

  describe "#efforts_in_range" do
    before do
      effort_in_range_emp1
      effort_in_range_emp2
      effort_out_of_range
    end

    context "when employee_ids is empty (include all)" do
      subject { build_service([]) }

      it "includes in-range efforts from all employees" do
        expect(subject.efforts_in_range).to include(effort_in_range_emp1, effort_in_range_emp2)
      end

      it "excludes efforts outside the date range" do
        expect(subject.efforts_in_range).not_to include(effort_out_of_range)
      end
    end

    context "when employee_ids contains specific IDs (inclusive filter)" do
      subject { build_service([employee1.id.to_s]) }

      it "includes in-range efforts from the specified employee" do
        expect(subject.efforts_in_range).to include(effort_in_range_emp1)
      end

      it "excludes efforts from employees not in the list" do
        expect(subject.efforts_in_range).not_to include(effort_in_range_emp2)
      end
    end

    context "when employee_ids contains multiple IDs" do
      subject { build_service([employee1.id.to_s, employee2.id.to_s]) }

      it "includes in-range efforts from all specified employees" do
        expect(subject.efforts_in_range).to include(effort_in_range_emp1, effort_in_range_emp2)
      end

      it "excludes efforts from employees not in the list" do
        other_employee = create(:employee)
        other_effort = create(:project_effort, project_position: position, employee: other_employee, date: in_range_date)
        expect(subject.efforts_in_range).not_to include(other_effort)
      end
    end
  end
end
