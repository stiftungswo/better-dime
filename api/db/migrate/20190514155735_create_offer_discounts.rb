class CreateOfferDiscounts < ActiveRecord::Migration[5.2]
  def change
    create_table :offer_discounts do |t|
      t.string :name, null: false
      t.references :offer, foreign_key: true
      t.boolean :percentage, null: false
      t.decimal :value, null: false

      t.timestamps
    end
  end
end
