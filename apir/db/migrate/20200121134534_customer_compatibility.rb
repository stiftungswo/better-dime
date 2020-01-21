class CustomerCompatibility < ActiveRecord::Migration[5.2]
  def self.up
    change_table :customers do |t|
      t.remove :customers_id
      t.references :company, foreign_key: { to_table: :customers }
    end

    rename_table :customer_tags_customers, :customer_taggable
  end

  def self.down
    change_table :customers do |t|
      t.remove :company_id
      t.references :customers, foreign_key: true
    end

    rename_table :customer_taggable, :customer_tags_customers
  end
end
