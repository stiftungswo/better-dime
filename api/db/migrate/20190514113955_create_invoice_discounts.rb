class CreateInvoiceDiscounts < ActiveRecord::Migration[5.2]
  def change
    create_table :invoice_discounts do |t|
      t.references :invoice, foreign_key: true
      t.string :name
      t.boolean :percentage
      t.decimal :value

      t.timestamps
    end
  end
end
