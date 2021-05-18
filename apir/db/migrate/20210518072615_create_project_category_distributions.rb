class CreateProjectCategoryDistributions < ActiveRecord::Migration[6.0]
  def change
    create_table :project_category_distributions do |t|
      t.integer :category_id
      t.integer :weight, null: false, default: 100

      t.timestamps
    end

    add_foreign_key :project_category_distributions, :project_categories, column: :category_id, primary_key: :id
  end
end
