class CreateInvoices < ActiveRecord::Migration[5.2]
  def change
    create_table :invoices do |t|
      t.references :customer, foreign_key: true
      t.references :address, foreign_key: true
      t.text :description, null: false
      t.date :ending, null: false
      t.date :beginning, null: false
      t.integer :fixed_price
      t.string :name, null: false
      t.decimal :fixed_price_vat
      t.bigint :accountant_id, null: false

      t.timestamps
    end

    add_foreign_key :invoices, :employees, column: :accountant_id
  end
end
