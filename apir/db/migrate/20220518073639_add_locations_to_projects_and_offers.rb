class AddLocationsToProjectsAndOffers < ActiveRecord::Migration[6.0]
  def change
    change_table :projects do |t|
      t.bigint :location_id, null: true, default: nil
    end
    change_table :offers do |t|
      t.bigint :location_id, null: true, default: nil
    end
  end
end
