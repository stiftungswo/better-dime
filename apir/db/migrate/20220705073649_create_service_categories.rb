class CreateServiceCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :service_categories do |t|
      # rails, why, just why are you like this?
      # https://stackoverflow.com/questions/27809342/rails-migration-add-reference-to-table-but-different-column-name-for-foreign-ke
      t.references :parent_category, foreign_key: { to_table: :service_categories }

      t.string :name, null: false
      t.integer :number, null: false

      t.timestamps
    end
    add_column :service_categories, :deleted_at, :datetime
    add_index :service_categories, :deleted_at

    add_reference :services, :service_category, foreign_key: true
  end
end
