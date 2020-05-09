class CreateOfferPositions < ActiveRecord::Migration[5.2]
  def change
    create_table :offer_positions do |t|
      t.decimal :amount, null: false, precision: 10, scale: 4
      t.string :description
      t.references :offer, foreign_key: true
      t.integer :order, null: false
      t.integer :price_per_rate, null: false
      t.references :rate_unit, foreign_key: true
      t.references :service, foreign_key: true
      t.decimal :vat, null: false, precision: 4, scale: 3

      t.timestamps
    end
  end
end
