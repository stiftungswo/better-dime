class CreateCostGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :cost_groups, id: false, primary_key: :number do |t|
      t.bigint :number, null: false
      t.string :name

      t.timestamps
    end

    add_index :cost_groups, :number, unique: true
  end
end
