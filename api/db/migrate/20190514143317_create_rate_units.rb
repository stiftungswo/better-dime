class CreateRateUnits < ActiveRecord::Migration[5.2]
  def change
    create_table :rate_units do |t|
      t.string :billing_unit
      t.string :effort_unit
      t.decimal :factor
      t.boolean :is_time
      t.string :name
      t.boolean :archived

      t.timestamps
    end
  end
end
