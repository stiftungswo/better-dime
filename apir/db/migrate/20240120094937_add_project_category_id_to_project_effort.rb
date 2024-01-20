class AddProjectCategoryIdToProjectEffort < ActiveRecord::Migration[6.0]
  def change
    change_table :project_efforts do |t|
      t.references :project_category, foreign_key: true, type: :unsigned_integer
    end
  end
end
