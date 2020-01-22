class AddPositionGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :position_groups do |t|
      t.string :name

      t.timestamps
    end

    add_reference :invoice_positions, :position_group, foreign_key: { to_table: :position_groups }
    add_reference :offer_positions, :position_group, foreign_key: { to_table: :position_groups }
    add_reference :project_positions, :position_group, foreign_key: { to_table: :position_groups }
  end
end
