class CreateProjectCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :project_categories do |t|
      t.boolean :archived
      t.string :name

      t.timestamps
    end
  end
end
