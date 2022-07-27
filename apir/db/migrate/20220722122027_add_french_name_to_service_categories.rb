class AddFrenchNameToServiceCategories < ActiveRecord::Migration[6.0]
  def change
    change_table :service_categories do |t|
      t.string :french_name, null: false
    end
  end
end
