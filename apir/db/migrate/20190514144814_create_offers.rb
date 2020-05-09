class CreateOffers < ActiveRecord::Migration[5.2]
  def change
    create_table :offers do |t|
      t.references :customer, foreign_key: true
      t.references :address, foreign_key: true
      t.text :description, null: false
      t.integer :fixed_price
      t.string :name, null: false
      t.references :rate_group, foreign_key: true
      t.text :short_description, null: false
      t.integer :status, null: false
      t.decimal :fixed_price_vat, precision: 4, scale: 3
      t.bigint :accountant_id, null: false

      t.timestamps
    end

    add_foreign_key :offers, :employees, column: :accountant_id
  end
end
