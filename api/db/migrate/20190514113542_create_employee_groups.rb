class CreateEmployeeGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :employee_groups do |t|
      t.string :name

      t.timestamps
    end
  end
end
