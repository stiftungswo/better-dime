class EmployeeCompatibility < ActiveRecord::Migration[5.2]
  def self.up
    change_table :employees do |t|
      t.decimal :first_vacation_takeover, precision: 10, null: false
    end
  end

  def self.down
    remove_column :employees, :first_vacation_takeover
  end
end
