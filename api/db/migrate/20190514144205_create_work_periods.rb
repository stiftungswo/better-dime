class CreateWorkPeriods < ActiveRecord::Migration[5.2]
  def change
    create_table :work_periods do |t|
      t.references :employee, foreign_key: true
      t.date :beginning
      t.date :ending
      t.integer :pensum
      t.decimal :vacation_takeover
      t.integer :yearly_vacation_budget

      t.timestamps
    end
  end
end
