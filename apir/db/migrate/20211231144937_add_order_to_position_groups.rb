class AddOrderToPositionGroups < ActiveRecord::Migration[6.0]
  def change
    # previous groups should have shared=true, new groups should have shared=false.
    add_column :position_groups, :shared, :boolean, default: true, null: false
    change_column_default :position_groups, :shared, from: true, to: false
    # add order
    add_column :position_groups, :order, :integer, null: true
  end
end
