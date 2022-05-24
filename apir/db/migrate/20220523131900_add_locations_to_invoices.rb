class AddLocationsToInvoices < ActiveRecord::Migration[6.0]
  def change
    change_table :invoices do |t|
      t.bigint :location_id, null: true, default: nil
    end
  end
end
