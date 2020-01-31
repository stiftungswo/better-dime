class CreateCostGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :costgroups, id: false, primary_key: :number do |t|
      t.bigint :number, null: false
      t.string :name, null: false

      t.timestamps
    end

    add_index :costgroups, :number, unique: true
  end
end
