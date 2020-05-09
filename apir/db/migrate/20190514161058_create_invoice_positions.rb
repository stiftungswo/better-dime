class CreateInvoicePositions < ActiveRecord::Migration[5.2]
  def change
    create_table :invoice_positions do |t|
      t.decimal :amount, null: false, precision: 10, scale: 4
      t.string :description, null: false
      t.references :invoice, foreign_key: true
      t.integer :order
      t.integer :price_per_rate, null: false
      t.references :rate_unit, foreign_key: true
      t.decimal :vat, null: false, precision: 4, scale: 3

      t.timestamps
    end
  end
end
