class CreateRateUnits < ActiveRecord::Migration[5.2]
  def change
    create_table :rate_units do |t|
      t.string :billing_unit, null: false
      t.string :effort_unit, null: false
      t.decimal :factor, null: false, default: 1, precision: 10, scale: 4
      t.boolean :is_time, null: false, default: false
      t.string :name, null: false
      t.boolean :archived, null: false, default: false

      t.timestamps
    end
  end
end
