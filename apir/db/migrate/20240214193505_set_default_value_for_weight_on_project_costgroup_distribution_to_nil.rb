class SetDefaultValueForWeightOnProjectCostgroupDistributionToNil < ActiveRecord::Migration[6.0]
  def change
    change_column_null :project_costgroup_distributions, :weight, from: false, to: true
  end
end
