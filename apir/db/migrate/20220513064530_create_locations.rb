class CreateLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :locations do |t|
      t.boolean :archived, null: false
      t.integer :order, null: false, default: 9999

      t.string :name, null: false
      t.string :url, null: false

      t.timestamps
    end
  end
end
