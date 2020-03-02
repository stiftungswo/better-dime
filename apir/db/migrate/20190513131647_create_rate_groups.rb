class CreateRateGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :rate_groups do |t|
      t.string :name, null: false
      t.string :description, null: false
    end
  end
end
