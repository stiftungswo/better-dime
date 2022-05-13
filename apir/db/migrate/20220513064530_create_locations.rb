class CreateLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :locations do |t|
      t.boolean :archived, null: false
      t.string :name, null: false
      t.string :url, null: false

      t.timestamps
    end
  end
end
