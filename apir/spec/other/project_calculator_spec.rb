# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCalculator do
  it "calculates project properties correctly without fix prices" do
    offer = create(:offer)
    project = create(:project, offer: offer)

    no_time_unit = create(:rate_unit, is_time: false)

    o_position_a = create(:offer_position, offer: offer, vat: 0.077, price_per_rate: 322, amount: 13.31)
    o_position_b = create(:offer_position, offer: offer, vat: 0.077, price_per_rate: 125, amount: 13.145)
    o_position_c = create(:offer_position, offer: offer, vat: 0.025, price_per_rate: 222, amount: 6.6)
    o_position_d = create(:offer_position, offer: offer, vat: 0.025, price_per_rate: 66, amount: 54.6)
    o_position_e = create(:offer_position, offer: offer, vat: 0.077, price_per_rate: 911, amount: 12.22)

    discount_a = create(:offer_discount, offer: offer, percentage: false, value: 151.1)
    discount_b = create(:offer_discount, offer: offer, percentage: true, value: 0.03156)

    position_a = create(:project_position, project: project, vat: 0.077, price_per_rate: 322)
    position_b = create(:project_position, project: project, vat: 0.077, price_per_rate: 125)
    position_c = create(:project_position, project: project, vat: 0.025, price_per_rate: 222)
    position_d = create(:project_position, project: project, vat: 0.025, price_per_rate: 66)
    position_e = create(:project_position, project: project, vat: 0.077, price_per_rate: 911, rate_unit: no_time_unit)

    effort_a = create(:project_effort, value: 12.3, project_position: position_a, date: "2019-05-14")
    effort_b = create(:project_effort, value: 5.13, project_position: position_b, date: "2019-05-14")
    effort_c = create(:project_effort, value: 17.455, project_position: position_c, date: "2019-05-16")
    effort_d = create(:project_effort, value: 42.3, project_position: position_d, date: "2019-05-17")
    effort_e = create(:project_effort, value: 3.3, project_position: position_e, date: "2019-06-05")

    calculator = described_class.new(project)

    expect(calculator.budget_price).to eq(22_655.0)
    expect(calculator.budget_time).to eq(50_337.0)
    expect(calculator.current_price).to eq(30.3321)
    expect(calculator.current_time).to eq(70.56)
  end

  it "calculates project properties correctly with fix prices" do
    offer = create(:offer, fixed_price: 14_522)
    project = create(:project, offer: offer)

    no_time_unit = create(:rate_unit, is_time: false)

    o_position_a = create(:offer_position, offer: offer, vat: 0.077, price_per_rate: 322, amount: 13.31)
    o_position_b = create(:offer_position, offer: offer, vat: 0.077, price_per_rate: 125, amount: 13.145)
    o_position_c = create(:offer_position, offer: offer, vat: 0.025, price_per_rate: 222, amount: 6.6)
    o_position_d = create(:offer_position, offer: offer, vat: 0.025, price_per_rate: 66, amount: 54.6)
    o_position_e = create(:offer_position, offer: offer, vat: 0.077, price_per_rate: 911, amount: 12.22)

    discount_a = create(:offer_discount, offer: offer, percentage: false, value: 151.1)
    discount_b = create(:offer_discount, offer: offer, percentage: true, value: 0.03156)

    position_a = create(:project_position, project: project, vat: 0.077, price_per_rate: 322)
    position_b = create(:project_position, project: project, vat: 0.077, price_per_rate: 125)
    position_c = create(:project_position, project: project, vat: 0.025, price_per_rate: 222)
    position_d = create(:project_position, project: project, vat: 0.025, price_per_rate: 66)
    position_e = create(:project_position, project: project, vat: 0.077, price_per_rate: 911, rate_unit: no_time_unit)

    effort_a = create(:project_effort, value: 12.3, project_position: position_a, date: "2019-05-14")
    effort_b = create(:project_effort, value: 5.13, project_position: position_b, date: "2019-05-14")
    effort_c = create(:project_effort, value: 17.455, project_position: position_c, date: "2019-05-16")
    effort_d = create(:project_effort, value: 42.3, project_position: position_d, date: "2019-05-17")
    effort_e = create(:project_effort, value: 3.3, project_position: position_e, date: "2019-06-05")

    calculator = described_class.new(project)

    expect(calculator.budget_price).to eq(14_522)
    expect(calculator.budget_time).to eq(50_337.0)
    expect(calculator.current_price).to eq(30.3321)
    expect(calculator.current_time).to eq(70.56)
  end
end
