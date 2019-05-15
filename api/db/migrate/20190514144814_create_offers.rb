class CreateOffers < ActiveRecord::Migration[5.2]
  def change
    create_table :offers do |t|
      t.references :customer, foreign_key: true
      t.references :address, foreign_key: true
      t.text :description
      t.integer :fixed_price
      t.string :name
      t.references :rate_group, foreign_key: true
      t.text :short_description
      t.integer :status
      t.decimal :fixed_price_vat
      t.bigint :accountant_id, null: false

      t.timestamps
    end

    add_foreign_key :offers, :employees, column: :accountant_id
  end
end
