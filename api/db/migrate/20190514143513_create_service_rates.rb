class CreateServiceRates < ActiveRecord::Migration[5.2]
  def change
    create_table :service_rates do |t|
      t.references :rate_group, foreign_key: true
      t.references :service, foreign_key: true
      t.references :rate_unit, foreign_key: true
      t.integer :value, null: false

      t.timestamps
    end
  end
end
