class CreateWorkPeriods < ActiveRecord::Migration[5.2]
  def change
    create_table :work_periods do |t|
      t.references :employee, foreign_key: true
      t.date :beginning, null: false
      t.date :ending, null: false
      t.integer :pensum, null: false
      t.decimal :vacation_takeover, null: false, default: 0
      t.integer :yearly_vacation_budget, null: false

      t.timestamps
    end
  end
end
