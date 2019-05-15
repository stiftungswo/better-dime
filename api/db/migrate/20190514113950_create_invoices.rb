class CreateInvoices < ActiveRecord::Migration[5.2]
  def change
    create_table :invoices do |t|
      t.references :customer, foreign_key: true
      t.references :address, foreign_key: true
      t.text :description
      t.date :ending
      t.date :beginning
      t.integer :fixed_price
      t.string :name
      t.decimal :fixed_price_vat
      t.bigint :accountant_id, null: false

      t.timestamps
    end

    add_foreign_key :invoices, :employees, column: :accountant_id
  end
end
