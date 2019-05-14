class CreateAddresses < ActiveRecord::Migration[5.2]
  def change
    create_table :addresses do |t|
      t.string :city, null: false
      t.string :country
      t.string :description
      t.integer :zip, null: false
      t.string :street, null: false
      t.string :supplement, null: true
      t.references :customer, foreign_key: true

      t.timestamps
    end
  end
end
