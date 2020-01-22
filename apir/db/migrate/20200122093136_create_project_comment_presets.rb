class CreateProjectCommentPresets < ActiveRecord::Migration[5.2]
  def change
    create_table :project_comment_presets do |t|
      t.string :comment_preset

      t.timestamps
    end
  end
end
