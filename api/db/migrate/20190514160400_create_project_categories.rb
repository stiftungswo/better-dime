class CreateProjectCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :project_categories do |t|
      t.boolean :archived, null: false, default: false
      t.string :name, null: false

      t.timestamps
    end
  end
end
