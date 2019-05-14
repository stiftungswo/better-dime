class CreateProjectPositions < ActiveRecord::Migration[5.2]
  def change
    create_table :project_positions do |t|
      t.string :description
      t.integer :price_per_rate
      t.references :rate_unit, foreign_key: true
      t.references :service, foreign_key: true
      t.decimal :vat
      t.integer :order

      t.timestamps
    end

    # TODO: add project:references
  end
end
