class CreateHolidays < ActiveRecord::Migration[5.2]
  def change
    create_table :holidays do |t|
      t.string :name, null: false
      t.date :date, null: false
      t.integer :duration, null: false, default: 1

      t.timestamps
    end
  end
end
