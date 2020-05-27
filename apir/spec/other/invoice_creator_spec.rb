# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvoiceCreator do
  it "creates an invoice from a project" do
    project = create(:project)

    rate_unit_a = create(:rate_unit)
    rate_unit_b = create(:rate_unit, factor: 100, effort_unit: "dd")

    service_a = create(:service)
    service_b = create(:service, name: "The second service")

    service_rate_a = create(:service_rate, service: service_a, rate_unit: rate_unit_a)
    service_rate_b = create(:service_rate, service: service_b, rate_unit: rate_unit_b)

    position_a = create(:project_position, project: project, service: service_a, rate_unit: rate_unit_a)
    position_b = create(:project_position, project: project, service: service_b, rate_unit: rate_unit_b)

    created = described_class.create_invoice_from_project(project)

    expect(created.name).to eq(project.name)
    expect(created.fixed_price).to eq(project.fixed_price)
    expect(created.description).to eq(project.description)
    expect(created.accountant).to eq(project.accountant)
    expect(created.customer).to eq(project.customer)
    expect(created.address).to eq(project.address)
    expect(created.project).to eq(project)

    [position_a, position_b].each do |project_position|
      has_invoice_position = created.invoice_positions.any? do |i_position|
        i_position.description = project_position.description &&
                                 i_position.price_per_rate == project_position.price_per_rate &&
                                 i_position.order == project_position.order &&
                                 i_position.rate_unit == project_position.rate_unit &&
                                 i_position.invoice == created &&
                                 i_position.project_position == project_position &&
                                 i_position.position_group == project_position.position_group &&
                                 i_position.amount == project_position.efforts_value &&
                                 i_position.vat == project_position.vat
      end

      expect(has_invoice_position).to eq(true)
    end
  end
end
