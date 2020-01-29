class CreateProjectCostGroupDistributions < ActiveRecord::Migration[5.2]
  def change
    create_table :project_costgroup_distributions do |t|
      t.bigint :cost_group_number
      t.integer :weight, null: false, default: 100

      t.timestamps
    end

    add_foreign_key :project_costgroup_distributions, :cost_groups, column: :cost_group_number, primary_key: :number
  end
end
