# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_01_22_075144) do

  create_table "addresses", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "city", null: false
    t.string "country"
    t.string "description"
    t.integer "zip", null: false
    t.string "street", null: false
    t.string "supplement"
    t.bigint "customer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["customer_id"], name: "index_addresses_on_customer_id"
    t.index ["deleted_at"], name: "index_addresses_on_deleted_at"
  end

  create_table "cost_groups", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "number", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_cost_groups_on_deleted_at"
    t.index ["number"], name: "index_cost_groups_on_number", unique: true
  end

  create_table "customer_taggable", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "customer_tag_id", null: false
    t.bigint "customer_id", null: false
  end

  create_table "customer_tags", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.boolean "archived", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_customer_tags_on_deleted_at"
  end

  create_table "customers", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "type", null: false
    t.text "comment"
    t.string "department"
    t.string "email"
    t.string "first_name"
    t.string "last_name"
    t.boolean "hidden", default: false, null: false
    t.string "name"
    t.bigint "rate_group_id"
    t.string "salutation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.bigint "company_id"
    t.index ["company_id"], name: "index_customers_on_company_id"
    t.index ["deleted_at"], name: "index_customers_on_deleted_at"
    t.index ["rate_group_id"], name: "index_customers_on_rate_group_id"
  end

  create_table "employee_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_employee_groups_on_deleted_at"
  end

  create_table "employees", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "email", null: false
    t.boolean "admin"
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.boolean "can_login", default: true, null: false
    t.boolean "archived"
    t.integer "holidays_per_year"
    t.bigint "employee_group_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "remember_created_at"
    t.datetime "deleted_at"
    t.decimal "first_vacation_takeover", precision: 10, null: false
    t.index ["deleted_at"], name: "index_employees_on_deleted_at"
    t.index ["email"], name: "index_employees_on_email", unique: true
    t.index ["employee_group_id"], name: "index_employees_on_employee_group_id"
  end

  create_table "global_settings", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "sender_name", default: "Example Company", null: false
    t.string "sender_street", default: "Test street 1", null: false
    t.integer "sender_zip", default: 1234, null: false
    t.string "sender_phone", default: "044 333 44 55", null: false
    t.string "sender_city", default: "Zürich", null: false
    t.string "sender_mail", default: "dime@example.com", null: false
    t.string "sender_vat", default: "CHE-123.456.543", null: false
    t.string "sender_bank", default: "07-007-07", null: false
    t.string "sender_web", default: "https://github.com/stiftungswo/betterDime", null: false
    t.string "service_order_comment", default: "", null: false
    t.string "sender_bank_detail", default: "Example Bank, 0000 Example", null: false
    t.string "sender_bank_iban", default: "CH9300762011623852957", null: false
    t.string "sender_bank_bic", default: "EXABANK00000", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_global_settings_on_deleted_at"
  end

  create_table "holidays", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.date "date", null: false
    t.integer "duration", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_holidays_on_deleted_at"
  end

  create_table "invoice_cost_group_distributions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "cost_group_number"
    t.integer "weight", default: 100, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "invoice_id"
    t.datetime "deleted_at"
    t.index ["cost_group_number"], name: "fk_rails_bae2acfe5a"
    t.index ["deleted_at"], name: "index_invoice_cost_group_distributions_on_deleted_at"
    t.index ["invoice_id"], name: "index_invoice_cost_group_distributions_on_invoice_id"
  end

  create_table "invoice_discounts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "invoice_id"
    t.string "name", null: false
    t.boolean "percentage", null: false
    t.decimal "value", precision: 10, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_invoice_discounts_on_deleted_at"
    t.index ["invoice_id"], name: "index_invoice_discounts_on_invoice_id"
  end

  create_table "invoice_positions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.decimal "amount", precision: 10, null: false
    t.string "description", null: false
    t.bigint "invoice_id"
    t.integer "order"
    t.integer "price_per_rate", null: false
    t.bigint "rate_unit_id"
    t.decimal "vat", precision: 10, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_position_id"
    t.datetime "deleted_at"
    t.bigint "position_group_id"
    t.index ["deleted_at"], name: "index_invoice_positions_on_deleted_at"
    t.index ["invoice_id"], name: "index_invoice_positions_on_invoice_id"
    t.index ["position_group_id"], name: "index_invoice_positions_on_position_group_id"
    t.index ["project_position_id"], name: "index_invoice_positions_on_project_position_id"
    t.index ["rate_unit_id"], name: "index_invoice_positions_on_rate_unit_id"
  end

  create_table "invoices", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "customer_id"
    t.bigint "address_id"
    t.text "description", null: false
    t.date "start", null: false
    t.date "end", null: false
    t.integer "fixed_price"
    t.string "name", null: false
    t.decimal "fixed_price_vat", precision: 10
    t.bigint "accountant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_id"
    t.datetime "deleted_at"
    t.index ["accountant_id"], name: "fk_rails_d3f137fd7a"
    t.index ["address_id"], name: "index_invoices_on_address_id"
    t.index ["customer_id"], name: "index_invoices_on_customer_id"
    t.index ["deleted_at"], name: "index_invoices_on_deleted_at"
    t.index ["project_id"], name: "index_invoices_on_project_id"
  end

  create_table "offer_discounts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "offer_id"
    t.boolean "percentage", null: false
    t.decimal "value", precision: 10, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_offer_discounts_on_deleted_at"
    t.index ["offer_id"], name: "index_offer_discounts_on_offer_id"
  end

  create_table "offer_positions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.decimal "amount", precision: 10, null: false
    t.string "description"
    t.bigint "offer_id"
    t.integer "order", null: false
    t.integer "price_per_rate", null: false
    t.bigint "rate_unit_id"
    t.bigint "service_id"
    t.decimal "vat", precision: 10, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.bigint "position_group_id"
    t.index ["deleted_at"], name: "index_offer_positions_on_deleted_at"
    t.index ["offer_id"], name: "index_offer_positions_on_offer_id"
    t.index ["position_group_id"], name: "index_offer_positions_on_position_group_id"
    t.index ["rate_unit_id"], name: "index_offer_positions_on_rate_unit_id"
    t.index ["service_id"], name: "index_offer_positions_on_service_id"
  end

  create_table "offers", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "customer_id"
    t.bigint "address_id"
    t.text "description", null: false
    t.integer "fixed_price"
    t.string "name", null: false
    t.bigint "rate_group_id"
    t.text "short_description", null: false
    t.integer "status", null: false
    t.decimal "fixed_price_vat", precision: 10
    t.bigint "accountant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["accountant_id"], name: "fk_rails_0fd97c6fab"
    t.index ["address_id"], name: "index_offers_on_address_id"
    t.index ["customer_id"], name: "index_offers_on_customer_id"
    t.index ["deleted_at"], name: "index_offers_on_deleted_at"
    t.index ["rate_group_id"], name: "index_offers_on_rate_group_id"
  end

  create_table "phones", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "number"
    t.integer "category"
    t.bigint "customer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["customer_id"], name: "index_phones_on_customer_id"
    t.index ["deleted_at"], name: "index_phones_on_deleted_at"
  end

  create_table "position_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_categories", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.boolean "archived", default: false, null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_project_categories_on_deleted_at"
  end

  create_table "project_comments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "comment", null: false
    t.date "date", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_id"
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_project_comments_on_deleted_at"
    t.index ["project_id"], name: "index_project_comments_on_project_id"
  end

  create_table "project_cost_group_distributions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "cost_group_id"
    t.integer "weight", default: 100, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_id"
    t.datetime "deleted_at"
    t.index ["cost_group_id"], name: "fk_rails_47731351c6"
    t.index ["deleted_at"], name: "index_project_cost_group_distributions_on_deleted_at"
    t.index ["project_id"], name: "index_project_cost_group_distributions_on_project_id"
  end

  create_table "project_efforts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.date "date", null: false
    t.bigint "employee_id"
    t.bigint "project_position_id"
    t.decimal "value", precision: 10, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_project_efforts_on_deleted_at"
    t.index ["employee_id"], name: "index_project_efforts_on_employee_id"
    t.index ["project_position_id"], name: "index_project_efforts_on_project_position_id"
  end

  create_table "project_positions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "description"
    t.integer "price_per_rate", default: 0, null: false
    t.bigint "rate_unit_id"
    t.bigint "service_id"
    t.decimal "vat", precision: 10, default: "0", null: false
    t.integer "order", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_id"
    t.datetime "deleted_at"
    t.bigint "position_group_id"
    t.index ["deleted_at"], name: "index_project_positions_on_deleted_at"
    t.index ["position_group_id"], name: "index_project_positions_on_position_group_id"
    t.index ["project_id"], name: "index_project_positions_on_project_id"
    t.index ["rate_unit_id"], name: "index_project_positions_on_rate_unit_id"
    t.index ["service_id"], name: "index_project_positions_on_service_id"
  end

  create_table "projects", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "accountant_id", null: false
    t.bigint "customer_id"
    t.bigint "address_id"
    t.boolean "archived", default: false, null: false
    t.bigint "project_category_id"
    t.boolean "chargeable", default: true, null: false
    t.date "deadline"
    t.text "description"
    t.integer "fixed_price"
    t.string "name", null: false
    t.bigint "offer_id"
    t.bigint "rate_group_id"
    t.boolean "vacation_project", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["accountant_id"], name: "fk_rails_a7331964e9"
    t.index ["address_id"], name: "index_projects_on_address_id"
    t.index ["customer_id"], name: "index_projects_on_customer_id"
    t.index ["deleted_at"], name: "index_projects_on_deleted_at"
    t.index ["offer_id"], name: "index_projects_on_offer_id"
    t.index ["project_category_id"], name: "index_projects_on_project_category_id"
    t.index ["rate_group_id"], name: "index_projects_on_rate_group_id"
  end

  create_table "rate_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "description", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_rate_groups_on_deleted_at"
  end

  create_table "rate_units", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "billing_unit", null: false
    t.string "effort_unit", null: false
    t.decimal "factor", precision: 10, default: "1", null: false
    t.boolean "is_time", default: false, null: false
    t.string "name", null: false
    t.boolean "archived", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_rate_units_on_deleted_at"
  end

  create_table "service_rates", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "rate_group_id"
    t.bigint "service_id"
    t.bigint "rate_unit_id"
    t.integer "value", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_service_rates_on_deleted_at"
    t.index ["rate_group_id"], name: "index_service_rates_on_rate_group_id"
    t.index ["rate_unit_id"], name: "index_service_rates_on_rate_unit_id"
    t.index ["service_id"], name: "index_service_rates_on_service_id"
  end

  create_table "services", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.decimal "vat", precision: 10, null: false
    t.boolean "archived", default: false, null: false
    t.integer "order", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_services_on_deleted_at"
  end

  create_table "versions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "item_type", limit: 191, null: false
    t.bigint "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object", limit: 4294967295
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  create_table "whitelisted_jwts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "jti", null: false
    t.string "aud"
    t.datetime "exp", null: false
    t.bigint "employee_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_whitelisted_jwts_on_employee_id"
    t.index ["jti"], name: "index_whitelisted_jwts_on_jti", unique: true
  end

  create_table "work_periods", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "employee_id"
    t.date "beginning", null: false
    t.date "ending", null: false
    t.integer "pensum", null: false
    t.decimal "vacation_takeover", precision: 10, default: "0", null: false
    t.integer "yearly_vacation_budget", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_work_periods_on_deleted_at"
    t.index ["employee_id"], name: "index_work_periods_on_employee_id"
  end

  add_foreign_key "addresses", "customers"
  add_foreign_key "customers", "customers", column: "company_id"
  add_foreign_key "customers", "rate_groups"
  add_foreign_key "employees", "employee_groups"
  add_foreign_key "invoice_cost_group_distributions", "cost_groups", column: "cost_group_number", primary_key: "number"
  add_foreign_key "invoice_cost_group_distributions", "invoices"
  add_foreign_key "invoice_discounts", "invoices"
  add_foreign_key "invoice_positions", "invoices"
  add_foreign_key "invoice_positions", "position_groups"
  add_foreign_key "invoice_positions", "project_positions"
  add_foreign_key "invoice_positions", "rate_units"
  add_foreign_key "invoices", "addresses"
  add_foreign_key "invoices", "customers"
  add_foreign_key "invoices", "employees", column: "accountant_id"
  add_foreign_key "invoices", "projects"
  add_foreign_key "offer_discounts", "offers"
  add_foreign_key "offer_positions", "offers"
  add_foreign_key "offer_positions", "position_groups"
  add_foreign_key "offer_positions", "rate_units"
  add_foreign_key "offer_positions", "services"
  add_foreign_key "offers", "addresses"
  add_foreign_key "offers", "customers"
  add_foreign_key "offers", "employees", column: "accountant_id"
  add_foreign_key "offers", "rate_groups"
  add_foreign_key "phones", "customers"
  add_foreign_key "project_comments", "projects"
  add_foreign_key "project_cost_group_distributions", "cost_groups", primary_key: "number"
  add_foreign_key "project_cost_group_distributions", "projects"
  add_foreign_key "project_efforts", "employees"
  add_foreign_key "project_efforts", "project_positions"
  add_foreign_key "project_positions", "position_groups"
  add_foreign_key "project_positions", "projects"
  add_foreign_key "project_positions", "rate_units"
  add_foreign_key "project_positions", "services"
  add_foreign_key "projects", "addresses"
  add_foreign_key "projects", "customers"
  add_foreign_key "projects", "employees", column: "accountant_id"
  add_foreign_key "projects", "offers"
  add_foreign_key "projects", "project_categories"
  add_foreign_key "projects", "rate_groups"
  add_foreign_key "service_rates", "rate_groups"
  add_foreign_key "service_rates", "rate_units"
  add_foreign_key "service_rates", "services"
  add_foreign_key "whitelisted_jwts", "employees", on_delete: :cascade
  add_foreign_key "work_periods", "employees"
end
