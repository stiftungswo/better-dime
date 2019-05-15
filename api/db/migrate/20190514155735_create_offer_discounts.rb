class CreateOfferDiscounts < ActiveRecord::Migration[5.2]
  def change
    create_table :offer_discounts do |t|
      t.string :name
      t.references :offer, foreign_key: true
      t.boolean :percentage
      t.decimal :value

      t.timestamps
    end
  end
end
