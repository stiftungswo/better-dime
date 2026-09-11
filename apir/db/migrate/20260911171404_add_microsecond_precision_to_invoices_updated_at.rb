# frozen_string_literal: true

class AddMicrosecondPrecisionToInvoicesUpdatedAt < ActiveRecord::Migration[8.0]
  def up
    change_column :invoices, :updated_at, :datetime, precision: 6
  end

  def down
    change_column :invoices, :updated_at, :datetime, precision: nil
  end
end
