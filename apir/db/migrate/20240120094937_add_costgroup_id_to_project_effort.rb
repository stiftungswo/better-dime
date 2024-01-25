class AddCostgroupIdToProjectEffort < ActiveRecord::Migration[6.0]
  def change
    change_table :project_efforts do |t|
      t.references :costgroup_number, references: :costgroups, null: true, type: :unsigned_integer
    end

    rename_column :project_efforts, :costgroup_number_id, :costgroup_number
    add_foreign_key :project_efforts, :costgroups, column: 'costgroup_number', primary_key: 'number'
  end
end
