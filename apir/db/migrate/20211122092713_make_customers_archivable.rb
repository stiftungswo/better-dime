class MakeCustomersArchivable < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :archived, :boolean, default: false, null: false
  end
end
