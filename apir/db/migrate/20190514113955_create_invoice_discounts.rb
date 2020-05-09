class CreateInvoiceDiscounts < ActiveRecord::Migration[5.2]
  def change
    create_table :invoice_discounts do |t|
      t.references :invoice, foreign_key: true
      t.string :name, null: false
      t.boolean :percentage, null: false
      t.decimal :value, null: false, precision: 10, scale: 4

      t.timestamps
    end
  end
end
