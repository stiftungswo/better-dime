class AddCostGroupsAndProjectCategoriesToOffers < ActiveRecord::Migration[6.0]
  def change
    # project_categories
    create_table :offer_category_distributions do |t|
      t.integer :category_id, null: false, unsigned: true
      t.integer :weight, null: false, default: 100
      t.integer :offer_id, null: false, unsigned: true

      t.timestamps
      t.timestamp "deleted_at"
    end
    # yes, it's project_categories, even though it's offer_category_distributions
    add_foreign_key :offer_category_distributions, :project_categories, column: :category_id, primary_key: :id
    add_foreign_key :offer_category_distributions, :offers, column: :offer_id, primary_key: :id

    # cost_groups
    create_table :offer_costgroup_distributions do |t|
      t.integer :costgroup_number, null: false, unsigned: true
      t.integer :weight, null: false, default: 100
      t.integer :offer_id, null: false, unsigned: true

      t.timestamps
      t.timestamp "deleted_at"
      # no idea what these are used for, just adding them to be consistent with projects.
      t.integer "created_by"
      t.integer "updated_by"
      t.integer "deleted_by"
    end
    add_foreign_key :offer_costgroup_distributions, :costgroups, column: :costgroup_number, primary_key: :number
    add_foreign_key :offer_costgroup_distributions, :offers, column: :offer_id, primary_key: :id
  end
end
