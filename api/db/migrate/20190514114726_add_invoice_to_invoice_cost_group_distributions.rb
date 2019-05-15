class AddInvoiceToInvoiceCostGroupDistributions < ActiveRecord::Migration[5.2]
  def change
    add_reference :invoice_cost_group_distributions, :invoice, foreign_key: true
  end
end
