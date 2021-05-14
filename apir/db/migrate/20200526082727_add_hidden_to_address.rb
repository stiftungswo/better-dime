class AddHiddenToAddress < ActiveRecord::Migration[6.0]
  def change
    # Test change
    add_column :addresses, :hidden, :boolean, null: false, default: false
  end
end
