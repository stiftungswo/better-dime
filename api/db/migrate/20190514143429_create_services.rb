class CreateServices < ActiveRecord::Migration[5.2]
  def change
    create_table :services do |t|
      t.string :name, null: false
      t.string :description
      t.decimal :vat, null: false
      t.boolean :archived, null: false, default: false
      t.integer :order, null: false, default: 0

      t.timestamps
    end
  end
end
