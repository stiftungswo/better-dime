class CreateInvoicePositions < ActiveRecord::Migration[5.2]
  def change
    create_table :invoice_positions do |t|
      t.decimal :amount
      t.string :description
      t.references :invoice, foreign_key: true
      t.integer :order
      t.integer :price_per_rate
      t.references :rate_unit, foreign_key: true
      t.decimal :vat

      t.timestamps
    end
  end
end
