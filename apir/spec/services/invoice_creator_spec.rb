# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvoiceCreator do
  let(:rate_group) { create(:rate_group) }
  let(:costgroup) { create(:costgroup) }
  let(:category) { create(:project_category) }
  let(:service) { create(:service) }
  let(:rate_unit) { create(:rate_unit, factor: 60) }
  let(:project) { create(:project, rate_group: rate_group) }

  before do
    create(:project_costgroup_distribution, project: project, costgroup: costgroup, weight: 100)
    create(:project_category_distribution, project: project, project_category: category, weight: 100)
  end

  describe ".create_invoice_from_project" do
    it "creates an invoice with project attributes" do
      invoice = described_class.create_invoice_from_project(project)

      expect(invoice.name).to eq(project.name)
      expect(invoice.customer).to eq(project.customer)
      expect(invoice.accountant).to eq(project.accountant)
      expect(invoice.address).to eq(project.address)
      expect(invoice.project).to eq(project)
    end

    it "copies costgroup distributions from project" do
      invoice = described_class.create_invoice_from_project(project)

      expect(invoice.invoice_costgroup_distributions.length).to eq(1)
      expect(invoice.invoice_costgroup_distributions.first.costgroup).to eq(costgroup)
    end

    it "creates positions from project positions with effort amounts" do
      position = create(:project_position, project: project, service: service, rate_unit: rate_unit)
      create(:project_effort, project_position: position, value: 120, date: Time.zone.today, costgroup: costgroup)

      invoice = described_class.create_invoice_from_project(project)

      expect(invoice.invoice_positions.length).to eq(1)
      expect(invoice.invoice_positions.first.amount).to eq(2.0)
    end
  end

  describe ".update_timespan" do
    it "updates beginning and ending and re-copies project data" do
      invoice = create(:invoice, project: project, beginning: "2026-01-01", ending: "2026-01-31")

      result = described_class.update_timespan(invoice, Date.new(2026, 2, 1), Date.new(2026, 2, 28))

      expect(result.beginning).to eq(Date.new(2026, 2, 1))
      expect(result.ending).to eq(Date.new(2026, 2, 28))
      expect(result.name).to eq(project.name)
    end
  end

  describe ".get_invoice_beginning_date" do
    it "returns day after last invoice ending when invoices exist" do
      create(:invoice, project: project, beginning: "2026-01-01", ending: "2026-01-31")

      date = described_class.get_invoice_beginning_date(project)

      expect(date).to eq(Date.new(2026, 2, 1))
    end

    it "returns earliest effort date when no invoices exist" do
      project_no_inv = create(:project)
      position = create(:project_position, project: project_no_inv, service: service, rate_unit: rate_unit)
      create(:project_effort, project_position: position, value: 60, date: Date.new(2026, 3, 15), costgroup: costgroup)

      date = described_class.get_invoice_beginning_date(project_no_inv)

      expect(date).to eq(Date.new(2026, 3, 15))
    end
  end

  describe ".create_invoice" do
    it "copies offer discounts to invoice" do
      offer = project.offer
      create(:offer_discount, offer: offer, name: "Test Discount", value: 10.0, percentage: false)

      invoice = Invoice.new
      invoice.beginning = Date.new(2026, 1, 1)
      invoice.ending = Date.new(2026, 1, 31)
      result = described_class.create_invoice(invoice, project)

      expect(result.invoice_discounts.length).to eq(1)
      expect(result.invoice_discounts.first.name).to eq("Test Discount")
    end
  end
end
