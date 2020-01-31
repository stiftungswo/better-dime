class CreateInvoiceCostGroupDistributions < ActiveRecord::Migration[5.2]
  def change
    create_table :invoice_costgroup_distributions do |t|
      t.bigint :costgroup_number
      t.integer :weight, null: false, default: 100, null: false

      t.timestamps
    end

    add_foreign_key :invoice_costgroup_distributions, :costgroups, column: :costgroup_number, primary_key: :number
  end
end
