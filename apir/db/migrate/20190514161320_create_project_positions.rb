class CreateProjectPositions < ActiveRecord::Migration[5.2]
  def change
    create_table :project_positions do |t|
      t.string :description
      t.integer :price_per_rate, null: false, default: 0
      t.references :rate_unit, foreign_key: true
      t.references :service, foreign_key: true
      t.decimal :vat, null: false, default: 0.077, precision: 4, scale: 3
      t.integer :order, null: false, default: 0

      t.timestamps
    end
  end
end
