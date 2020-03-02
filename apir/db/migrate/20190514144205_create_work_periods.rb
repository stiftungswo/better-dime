class CreateWorkPeriods < ActiveRecord::Migration[5.2]
  def change
    create_table :work_periods do |t|
      t.references :employee, foreign_key: true
      t.date :start, null: false
      t.date :end, null: false
      t.integer :pensum, null: false
      t.integer :yearly_vacation_budget, null: false

      t.timestamps
    end
  end
end
