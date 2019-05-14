class CreateProjectComments < ActiveRecord::Migration[5.2]
  def change
    create_table :project_comments do |t|
      t.text :comment
      t.date :date

      t.timestamps
    end
  end

  # TODO: add project:references
end
