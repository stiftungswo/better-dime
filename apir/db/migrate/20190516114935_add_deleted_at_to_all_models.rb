# frozen_string_literal: true

TABLES = %i[
  addresses
  cost_groups
  customer_tags
  customers
  employee_groups
  employees
  global_settings
  holidays
  invoice_cost_group_distributions
  invoice_discounts
  invoice_positions
  invoices
  offer_discounts
  offer_positions
  offers
  phones
  project_categories
  project_comments
  project_cost_group_distributions
  project_efforts
  project_positions
  projects
  rate_groups
  rate_units
  service_rates
  services
  work_periods
].freeze

class AddDeletedAtToAllModels < ActiveRecord::Migration[5.2]
  def change
    TABLES.each do |table|
      add_column table, :deleted_at, :datetime
      add_index table, :deleted_at
    end
  end
end
