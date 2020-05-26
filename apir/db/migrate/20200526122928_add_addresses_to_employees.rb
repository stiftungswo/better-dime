class AddAddressesToEmployees < ActiveRecord::Migration[6.0]
  def change
    change_column_null :addresses, :customer_id, true
    add_column :addresses, :employee_id, :integer, unsigned: true, null: true
    add_foreign_key :addresses, :employees
  end
end
