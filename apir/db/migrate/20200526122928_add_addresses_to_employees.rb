class AddAddressesToEmployees < ActiveRecord::Migration[6.0]
  def change
    change_column_null :addresses, :customer_id, true
    change_table :addresses do |t|
      t.references :employee_id, foreign_key: { to_table: :employees}, null: true
    end
  end
end
