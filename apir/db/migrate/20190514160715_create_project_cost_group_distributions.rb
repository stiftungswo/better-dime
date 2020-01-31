class CreateProjectCostGroupDistributions < ActiveRecord::Migration[5.2]
  def change
    create_table :project_costgroup_distributions do |t|
      t.bigint :costgroup_number
      t.integer :weight, null: false, default: 100

      t.timestamps
    end

    add_foreign_key :project_costgroup_distributions, :costgroups, column: :costgroup_number, primary_key: :number
  end
end
