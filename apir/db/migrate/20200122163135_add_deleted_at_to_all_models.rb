# frozen_string_literal: true

TABLES = %i[
  addresses
  costgroups
  customer_tags
  customers
  employee_groups
  employees
  global_settings
  holidays
  invoice_costgroup_distributions
  invoice_discounts
  invoice_positions
  invoices
  offer_discounts
  offer_positions
  offers
  phones
  position_groups
  project_categories
  project_comments
  project_comment_presets
  project_costgroup_distributions
  project_efforts
  project_positions
  projects
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
