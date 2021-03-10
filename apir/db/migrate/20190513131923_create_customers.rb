class CreateCustomers < ActiveRecord::Migration[5.2]
  def change
    create_table :customers do |t|
      t.string :type, null: false
      t.text :comment, null: true
      t.string :department, null: true
      t.boolean :department_in_address, null: false, default: false
      t.references :customers, foreign_key: true
      t.string :email, null: true
      t.string :first_name, null: true
      t.string :last_name, null: true
      t.boolean :hidden, null: false, default: false
      t.string :name, null: true, unique: true
      t.bigint :accountant_id
      t.references :rate_group, foreign_key: true
      t.string :salutation, null: true
      t.boolean :newsletter, default: false, null: false
      t.boolean :biodiversity_course, default: false, null: false

      t.timestamps
    end

  end
end
