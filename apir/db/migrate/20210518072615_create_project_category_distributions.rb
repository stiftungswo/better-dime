class CreateProjectCategoryDistributions < ActiveRecord::Migration[6.0]
  def change
    create_table :project_category_distributions do |t|
      t.bigint :category_id, null: false
      t.integer :weight, null: false, default: 100
      t.bigint :project_id, null: false

      t.timestamps
    end

    add_foreign_key :project_category_distributions, :project_categories, column: :category_id, primary_key: :id
    add_foreign_key :project_category_distributions, :projects, column: :project_id, primary_key: :id
    add_column :project_category_distributions, :deleted_at, :datetime
    add_index :project_category_distributions, :deleted_at
  end
end
