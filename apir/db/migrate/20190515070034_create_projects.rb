class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.bigint :accountant_id, null: false
      t.references :customer, foreign_key: true
      t.references :address, foreign_key: true
      t.boolean :archived, null: false, default: false
      t.references :category, foreign_key: { to_table: :project_categories }
      t.boolean :chargeable, null: false, default: true
      t.date :deadline
      t.text :description
      t.integer :fixed_price
      t.string :name, null: false
      t.references :offer, foreign_key: true
      t.references :rate_group, foreign_key: true
      t.boolean :vacation_project, null: false, default: false

      t.timestamps
    end

    add_foreign_key :projects, :employees, column: :accountant_id
  end
end
