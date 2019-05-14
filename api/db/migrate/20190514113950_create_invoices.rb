class CreateInvoices < ActiveRecord::Migration[5.2]
  def change
    create_table :invoices do |t|
      t.references :employee, foreign_key: true
      t.references :customer, foreign_key: true
      t.references :address, foreign_key: true
      t.text :description
      t.date :ending
      t.date :beginning
      t.integer :fixed_price
      t.string :name
      t.decimal :fixed_price_vat

      t.timestamps
    end

    # todo Add `t.references :project, foreign_key: true` in a later migration
  end
end
