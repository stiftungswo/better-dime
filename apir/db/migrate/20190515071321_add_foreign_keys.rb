class AddForeignKeys < ActiveRecord::Migration[5.2]
  def change
    add_reference :invoices, :project, foreign_key: true
    add_reference :project_comments, :project, foreign_key: true
    add_reference :project_cost_group_distributions, :project, foreign_key: true
    add_reference :project_positions, :project, foreign_key: true
    add_reference :invoice_positions, :project_positions, foreign_key: true
  end
end
