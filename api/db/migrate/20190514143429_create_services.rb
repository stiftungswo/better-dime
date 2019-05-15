class CreateServices < ActiveRecord::Migration[5.2]
  def change
    create_table :services do |t|
      t.string :name
      t.string :description
      t.decimal :vat
      t.boolean :archived
      t.integer :order

      t.timestamps
    end
  end
end
