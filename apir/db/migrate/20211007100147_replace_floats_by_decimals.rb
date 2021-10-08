class ReplaceFloatsByDecimals < ActiveRecord::Migration[6.0]
  def up
    change_column :rate_units, :factor, :decimal, precision: 4, scale: 0, default: 1.0, null: false
    change_column :services, :vat, :decimal, precision: 4, scale: 3, null: false
  end
  def down
    change_column :rate_units, :factor, :float, limit: 53, default: 1.0, null: false
    change_column :services, :vat, :float, limit: 53, null: false
  end
end
