class CreateOfferPositions < ActiveRecord::Migration[5.2]
  def change
    create_table :offer_positions do |t|
      t.decimal :amount
      t.string :description
      t.references :offer, foreign_key: true
      t.integer :order
      t.integer :price_per_rate
      t.references :rate_unit, foreign_key: true
      t.references :service, foreign_key: true
      t.decimal :vat

      t.timestamps
    end
  end
end
