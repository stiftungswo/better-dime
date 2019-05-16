class CreateCustomers < ActiveRecord::Migration[5.2]
  def change
    create_table :customers do |t|
      t.string :type, null: false
      t.text :comment, null: true
      t.string :department, null: true
      t.references :customers, foreign_key: true
      t.string :email, null: true
      t.string :first_name, null: true
      t.string :last_name, null: true
      t.boolean :hidden, null: false, default: false
      t.string :name, null: true, unique: true
      t.references :rate_group, foreign_key: true
      t.string :salutation, null: true

      t.timestamps
    end

  end
end
