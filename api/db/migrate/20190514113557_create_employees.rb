class CreateEmployees < ActiveRecord::Migration[5.2]
  def change
    create_table :employees do |t|
      t.string :email
      t.boolean :admin
      t.string :first_name
      t.string :last_name
      t.boolean :can_login
      t.boolean :archived
      t.integer :holidays_per_year
      t.references :employee_group, foreign_key: true

      t.timestamps
    end
  end
end
