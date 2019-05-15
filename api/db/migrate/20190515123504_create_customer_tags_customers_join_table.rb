class CreateCustomerTagsCustomersJoinTable < ActiveRecord::Migration[5.2]
  def change
    create_join_table :customer_tags, :customers
  end
end
