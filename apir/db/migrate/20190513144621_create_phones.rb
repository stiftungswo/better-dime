class CreatePhones < ActiveRecord::Migration[5.2]
  def change
    create_table :phones do |t|
      t.string :number
      t.integer :category
      t.references :customer, foreign_key: true

      t.timestamps
    end
  end
end
