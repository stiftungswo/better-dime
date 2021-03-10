class AddForeignKeys < ActiveRecord::Migration[5.2]
  def change
    add_reference :invoices, :project, foreign_key: true
    add_reference :project_comments, :project, foreign_key: true
    add_reference :project_costgroup_distributions, :project, foreign_key: true
    add_reference :project_positions, :project, foreign_key: true
    add_reference :invoice_positions, :project_position, foreign_key: { to_table: :project_positions }
    add_foreign_key :customers, :employees, column: :accountant_id
  end
end
