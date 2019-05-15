class CreateProjectEfforts < ActiveRecord::Migration[5.2]
  def change
    create_table :project_efforts do |t|
      t.date :date
      t.references :employee, foreign_key: true
      t.references :project_position, foreign_key: true
      t.decimal :value

      t.timestamps
    end
  end
end
