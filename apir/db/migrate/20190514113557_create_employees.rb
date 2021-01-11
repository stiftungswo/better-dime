class CreateEmployees < ActiveRecord::Migration[5.2]
  def change
    create_table :employees do |t|
      t.string :email, null: false
      t.boolean :is_admin
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.boolean :can_login, null: false, default: true
      t.boolean :archived
      t.integer :holidays_per_year, null: true
      t.references :employee_group, foreign_key: true
      t.boolean :hourly_paid

      t.timestamps
    end
  end
end
