class CreateInvoiceCostGroupDistributions < ActiveRecord::Migration[5.2]
  def change
    create_table :invoice_cost_group_distributions do |t|
      t.bigint :cost_group_number
      t.integer :weight, null: false, default: 100, null: false

      t.timestamps
    end

    add_foreign_key :invoice_cost_group_distributions, :cost_groups, column: :cost_group_number, primary_key: :number
  end
end
