# frozen_string_literal: true

require "rails_helper"

RSpec.describe WorkPeriodCalculator do
  let(:employee) { create(:employee, first_vacation_takeover: 0) }

  describe "#calculate" do
    it "returns empty array for empty work periods" do
      calc = described_class.new([])
      expect(calc.calculate).to eq([])
    end

    context "with a single work period" do
      let(:work_period) do
        create(:work_period,
          employee: employee,
          beginning: Date.new(2026, 1, 5),
          ending: Date.new(2026, 1, 30),
          pensum: 100,
          yearly_vacation_budget: 10_080)
      end

      it "returns a result hash with expected keys" do
        result = described_class.new([work_period]).calculate
        expect(result.length).to eq(1)
        period = result.first
        expect(period).to include(
          :id, :employee_id, :beginning, :ending, :pensum,
          :booked_minutes, :effective_time, :target_time,
          :period_vacation_budget, :remaining_vacation_budget,
          :overlapping_periods, :vacation_takeover
        )
      end

      it "calculates target time based on weekdays and pensum" do
        result = described_class.new([work_period]).calculate
        period = result.first
        expect(period[:target_time]).to be > 0
      end

      it "sets vacation_takeover from employee's first_vacation_takeover" do
        employee.update!(first_vacation_takeover: 120.0)
        result = described_class.new([work_period]).calculate
        expect(result.first[:vacation_takeover]).to eq(120.0)
      end
    end

    context "with holidays" do
      let(:work_period) do
        create(:work_period,
          employee: employee,
          beginning: Date.new(2026, 1, 5),
          ending: Date.new(2026, 1, 9),
          pensum: 100)
      end

      it "reduces target time for holidays within the period" do
        create(:holiday, date: Date.new(2026, 1, 7), duration: 504)

        result_with_holiday = described_class.new([work_period]).calculate.first[:target_time]

        Holiday.destroy_all
        result_without_holiday = described_class.new(WorkPeriod.where(id: work_period.id)).calculate.first[:target_time]

        expect(result_with_holiday).to be < result_without_holiday
      end
    end

    context "with booked efforts" do
      let(:rate_unit) { create(:rate_unit, factor: 1, is_time: true) }
      let(:service) { create(:service) }
      let(:project) { create(:project, vacation_project: false) }
      let(:position) { create(:project_position, project: project, rate_unit: rate_unit, service: service) }
      let(:costgroup) { create(:costgroup) }
      let(:work_period) do
        create(:work_period,
          employee: employee,
          beginning: Date.new(2026, 1, 5),
          ending: Date.new(2026, 1, 30),
          pensum: 100)
      end

      it "counts booked minutes from efforts within the period" do
        create(:project_effort, project_position: position, employee: employee, value: 480, date: Date.new(2026, 1, 10), costgroup: costgroup)

        result = described_class.new([work_period]).calculate
        expect(result.first[:booked_minutes]).to eq(480.0)
      end
    end

    context "with consecutive periods" do
      let(:period_a) do
        create(:work_period,
          employee: employee,
          beginning: Date.new(2026, 1, 1),
          ending: Date.new(2026, 3, 31),
          pensum: 100,
          hourly_paid: false)
      end

      let(:period_b) do
        create(:work_period,
          employee: employee,
          beginning: Date.new(2026, 4, 1),
          ending: Date.new(2026, 6, 30),
          pensum: 100,
          hourly_paid: false)
      end

      it "carries over vacation from previous period" do
        result = described_class.new([period_a, period_b]).calculate
        later_period = result.find { |p| p[:beginning] == Date.new(2026, 4, 1) }
        expect(later_period[:vacation_takeover]).not_to eq(0.0)
      end
    end

    context "with overlapping periods" do
      it "detects overlapping periods" do
        p1 = create(:work_period, employee: employee, beginning: Date.new(2026, 1, 1), ending: Date.new(2026, 6, 30), pensum: 50)
        p2 = create(:work_period, employee: employee, beginning: Date.new(2026, 3, 1), ending: Date.new(2026, 12, 31), pensum: 50)

        result = described_class.new([p1, p2]).calculate
        expect(result.any? { |p| p[:overlapping_periods] }).to be true
      end
    end

    context "with hourly_paid period" do
      it "uses employee first_vacation_takeover instead of previous period" do
        employee.update!(first_vacation_takeover: 42.0)
        p1 = create(:work_period, employee: employee, beginning: Date.new(2026, 1, 1), ending: Date.new(2026, 3, 31), pensum: 100, hourly_paid: false)
        p2 = create(:work_period, employee: employee, beginning: Date.new(2026, 4, 1), ending: Date.new(2026, 6, 30), pensum: 100, hourly_paid: true)

        result = described_class.new([p1, p2]).calculate
        hourly_period = result.find { |p| p[:beginning] == Date.new(2026, 4, 1) }
        expect(hourly_period[:vacation_takeover]).to eq(42.0)
      end
    end
  end
end
