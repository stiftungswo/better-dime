class AddLocalOrderToServices < ActiveRecord::Migration[6.0]
  def change
    change_table :services do |t|
      t.integer :local_order, null: false, default: 99
    end
  end
end
