class CreateCustomerTags < ActiveRecord::Migration[5.2]
  def change
    create_table :customer_tags do |t|
      t.boolean :archived, null: false
      t.string :name, null: false

      t.timestamps
    end
  end
end
