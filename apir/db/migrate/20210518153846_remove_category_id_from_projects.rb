class RemoveCategoryIdFromProjects < ActiveRecord::Migration[6.0]
  def change
    remove_column :projects, :category_id, :integer
  end
end
