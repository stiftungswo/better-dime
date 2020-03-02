class CreateProjectComments < ActiveRecord::Migration[5.2]
  def change
    create_table :project_comments do |t|
      t.text :comment, null: false
      t.date :date, null: false

      t.timestamps
    end
  end
end
