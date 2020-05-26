# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_26_122928) do

  create_table "addresses", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "city", null: false
    t.string "country"
    t.integer "customer_id", unsigned: true
    t.string "description"
    t.integer "zip", null: false
    t.string "street", null: false
    t.string "supplement"
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.boolean "hidden", default: false, null: false
    t.integer "employee_id", unsigned: true
    t.index ["customer_id"], name: "addresses_customer_id_foreign"
    t.index ["employee_id"], name: "fk_rails_1c4d4ea1f4"
  end

  create_table "costgroups", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "number", null: false, unsigned: true
    t.string "name", null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.index ["number"], name: "costgroups_number_unique", unique: true
  end

  create_table "customer_taggable", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "customer_tag_id", null: false
    t.integer "customer_id", null: false
  end

  create_table "customer_tags", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.boolean "archived", default: false, null: false
    t.string "name", null: false
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
  end

  create_table "customers", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "type", null: false
    t.text "comment"
    t.integer "company_id", unsigned: true
    t.string "department"
    t.string "email"
    t.string "first_name"
    t.string "last_name"
    t.boolean "hidden", default: false, null: false
    t.string "name"
    t.integer "rate_group_id", null: false, unsigned: true
    t.string "salutation"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["company_id"], name: "customers_company_id_foreign"
    t.index ["rate_group_id"], name: "customers_rate_group_id_foreign"
  end

  create_table "employee_groups", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", null: false
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
  end

  create_table "employee_settings", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "employee_id", unsigned: true
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.index ["employee_id"], name: "employee_settings_employee_id_unique", unique: true
  end

  create_table "employees", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "email", null: false
    t.string "encrypted_password", limit: 60, null: false
    t.boolean "is_admin", default: false, null: false
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.boolean "can_login", default: false, null: false
    t.boolean "archived", default: false, null: false
    t.integer "holidays_per_year"
    t.timestamp "deleted_at"
    t.integer "employee_group_id", unsigned: true
    t.decimal "first_vacation_takeover", precision: 8, scale: 2, default: "0.0", null: false
    t.string "locale", default: "de", null: false
    t.index ["email"], name: "employees_email_unique", unique: true
    t.index ["employee_group_id"], name: "employees_employee_group_id_foreign"
  end

  create_table "global_settings", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "sender_name", default: "Example Company", null: false
    t.string "sender_street", default: "Test street 1", null: false
    t.string "sender_zip", default: "1234", null: false
    t.string "sender_city", default: "Zürich", null: false
    t.string "sender_phone", default: "044 333 44 55", null: false
    t.string "sender_mail", default: "dime@example.com", null: false
    t.string "sender_vat", default: "CHE-123.456.543", null: false
    t.string "sender_bank", default: "07-007-07", null: false
    t.string "sender_web", default: "https://github.com/stiftungswo/betterDime", null: false
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.string "service_order_comment", null: false
    t.string "sender_bank_detail", default: "Example Bank, 0000 Example", null: false
    t.string "sender_bank_iban", default: "CH00 0000 0000 0000 0000 0", null: false
    t.string "sender_bank_bic", default: "EXABANK00000", null: false
  end

  create_table "holidays", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", null: false
    t.date "date", null: false
    t.integer "duration", null: false
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
  end

  create_table "invoice_costgroup_distributions", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "costgroup_number", unsigned: true
    t.integer "invoice_id", null: false, unsigned: true
    t.integer "weight", null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["costgroup_number"], name: "invoice_costgroup_distributions_costgroup_number_foreign"
    t.index ["invoice_id"], name: "invoice_costgroup_distributions_invoice_id_foreign"
  end

  create_table "invoice_discounts", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "invoice_id", unsigned: true
    t.string "name", null: false
    t.boolean "percentage", default: false, null: false
    t.decimal "value", precision: 11, scale: 3, null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["invoice_id"], name: "invoice_discounts_invoice_id_foreign"
  end

  create_table "invoice_positions", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.decimal "amount", precision: 8, scale: 2, null: false
    t.string "description", null: false
    t.integer "invoice_id", unsigned: true
    t.integer "order"
    t.integer "price_per_rate", null: false
    t.integer "project_position_id", unsigned: true
    t.integer "rate_unit_id", unsigned: true
    t.decimal "vat", precision: 4, scale: 3, null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.integer "position_group_id", unsigned: true
    t.index ["invoice_id"], name: "invoice_positions_invoice_id_foreign"
    t.index ["position_group_id"], name: "invoice_positions_position_group_id_foreign"
    t.index ["project_position_id"], name: "invoice_positions_project_position_id_foreign"
    t.index ["rate_unit_id"], name: "invoice_positions_rate_unit_id_foreign"
  end

  create_table "invoices", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "accountant_id", unsigned: true
    t.integer "customer_id", unsigned: true
    t.integer "address_id", unsigned: true
    t.text "description"
    t.date "ending"
    t.integer "fixed_price"
    t.integer "project_id", unsigned: true
    t.string "name", null: false
    t.date "beginning"
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.decimal "fixed_price_vat", precision: 4, scale: 3
    t.index ["accountant_id"], name: "invoices_accountant_id_foreign"
    t.index ["address_id"], name: "invoices_address_id_foreign"
    t.index ["customer_id"], name: "invoices_customer_id_foreign"
    t.index ["project_id"], name: "invoices_project_id_foreign"
  end

  create_table "migrations", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "migration", null: false
    t.integer "batch", null: false
  end

  create_table "offer_discounts", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", null: false
    t.integer "offer_id", null: false, unsigned: true
    t.boolean "percentage", default: false, null: false
    t.decimal "value", precision: 10, scale: 3, null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["offer_id"], name: "offer_discounts_offer_id_foreign"
  end

  create_table "offer_positions", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.decimal "amount", precision: 8, scale: 2, null: false
    t.string "description"
    t.integer "offer_id", null: false, unsigned: true
    t.integer "order", null: false
    t.integer "price_per_rate", null: false
    t.integer "rate_unit_id", unsigned: true
    t.integer "service_id", unsigned: true
    t.decimal "vat", precision: 4, scale: 3, null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.integer "position_group_id", unsigned: true
    t.index ["offer_id"], name: "offer_positions_offer_id_foreign"
    t.index ["position_group_id"], name: "offer_positions_position_group_id_foreign"
    t.index ["rate_unit_id"], name: "offer_positions_rate_unit_id_foreign"
    t.index ["service_id"], name: "offer_positions_service_id_foreign"
  end

  create_table "offers", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "accountant_id", unsigned: true
    t.integer "customer_id", unsigned: true
    t.integer "address_id", unsigned: true
    t.text "description"
    t.integer "fixed_price"
    t.string "name", null: false
    t.integer "rate_group_id", null: false, unsigned: true
    t.text "short_description"
    t.integer "status", limit: 1
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.decimal "fixed_price_vat", precision: 4, scale: 3
    t.index ["accountant_id"], name: "offers_accountant_id_foreign"
    t.index ["address_id"], name: "offers_address_id_foreign"
    t.index ["customer_id"], name: "offers_customer_id_foreign"
    t.index ["rate_group_id"], name: "offers_rate_group_id_foreign"
  end

  create_table "phones", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "category", null: false
    t.integer "customer_id", null: false, unsigned: true
    t.string "number", null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["customer_id"], name: "phones_customer_id_foreign"
  end

  create_table "position_groups", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
  end

  create_table "project_categories", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.boolean "archived", default: false, null: false
    t.string "name", null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
  end

  create_table "project_comment_presets", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "comment_preset", limit: 200, null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["comment_preset"], name: "project_comment_presets_comment_preset_unique", unique: true
  end

  create_table "project_comments", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.text "comment", null: false
    t.date "date", null: false
    t.integer "project_id", unsigned: true
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["project_id"], name: "project_comments_project_id_foreign"
  end

  create_table "project_costgroup_distributions", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "costgroup_number", unsigned: true
    t.integer "project_id", null: false, unsigned: true
    t.integer "weight", null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["costgroup_number"], name: "project_costgroup_distributions_costgroup_number_foreign"
    t.index ["project_id"], name: "project_costgroup_distributions_project_id_foreign"
  end

  create_table "project_efforts", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.date "date", null: false
    t.integer "employee_id", unsigned: true
    t.integer "position_id", unsigned: true
    t.decimal "value", precision: 10, scale: 3, null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["employee_id"], name: "project_efforts_employee_id_foreign"
    t.index ["position_id"], name: "project_efforts_position_id_foreign"
  end

  create_table "project_positions", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "description"
    t.integer "price_per_rate", null: false
    t.integer "project_id", unsigned: true
    t.integer "rate_unit_id", unsigned: true
    t.integer "service_id", unsigned: true
    t.decimal "vat", precision: 4, scale: 3, null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.integer "order", default: 0, null: false
    t.integer "position_group_id", unsigned: true
    t.index ["position_group_id"], name: "project_positions_position_group_id_foreign"
    t.index ["project_id"], name: "project_positions_project_id_foreign"
    t.index ["rate_unit_id"], name: "project_positions_rate_unit_id_foreign"
    t.index ["service_id"], name: "project_positions_service_id_foreign"
  end

  create_table "projects", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "accountant_id", unsigned: true
    t.integer "customer_id", unsigned: true
    t.integer "address_id", unsigned: true
    t.boolean "archived", default: false, null: false
    t.integer "category_id", unsigned: true
    t.boolean "chargeable", default: true, null: false
    t.date "deadline"
    t.text "description"
    t.integer "fixed_price"
    t.string "name", null: false
    t.integer "offer_id", unsigned: true
    t.integer "rate_group_id", null: false, unsigned: true
    t.boolean "vacation_project", default: false, null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["accountant_id"], name: "projects_accountant_id_foreign"
    t.index ["address_id"], name: "projects_address_id_foreign"
    t.index ["category_id"], name: "projects_category_id_foreign"
    t.index ["customer_id"], name: "projects_customer_id_foreign"
    t.index ["offer_id"], name: "projects_offer_id_foreign"
    t.index ["rate_group_id"], name: "projects_rate_group_id_foreign"
  end

  create_table "rate_groups", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
  end

  create_table "rate_units", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "billing_unit", null: false
    t.string "effort_unit"
    t.float "factor", limit: 53, default: 1.0, null: false
    t.boolean "is_time", null: false
    t.string "name", null: false
    t.boolean "archived", default: false, null: false
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
  end

  create_table "service_rates", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "rate_group_id", null: false, unsigned: true
    t.integer "service_id", null: false, unsigned: true
    t.integer "rate_unit_id", null: false, unsigned: true
    t.integer "value", null: false
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["rate_group_id"], name: "service_rates_rate_group_id_foreign"
    t.index ["rate_unit_id"], name: "service_rates_rate_unit_id_foreign"
    t.index ["service_id", "rate_group_id"], name: "service_rates_service_id_rate_group_id_unique", unique: true
  end

  create_table "services", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.float "vat", limit: 53, null: false
    t.boolean "archived", null: false
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.integer "order", default: 0, null: false
  end

  create_table "versions", id: :bigint, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "item_type", limit: 191, null: false
    t.bigint "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object", size: :long
    t.timestamp "created_at"
  end

  create_table "whitelisted_jwts", id: :bigint, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "jti", null: false
    t.string "aud"
    t.datetime "exp", null: false
    t.integer "employee_id", unsigned: true
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.timestamp "updated_at"
    t.index ["employee_id"], name: "whitelisted_jwts_employee_id_foreign"
  end

  create_table "work_periods", id: :integer, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "employee_id", null: false, unsigned: true
    t.date "ending", null: false
    t.integer "pensum", null: false
    t.date "beginning", null: false
    t.integer "yearly_vacation_budget", null: false
    t.timestamp "deleted_at"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer "created_by"
    t.integer "updated_by"
    t.integer "deleted_by"
    t.index ["employee_id"], name: "work_periods_employee_id_foreign"
  end

  add_foreign_key "addresses", "customers", name: "addresses_customer_id_foreign", on_delete: :cascade
  add_foreign_key "addresses", "employees"
  add_foreign_key "customers", "customers", column: "company_id", name: "customers_company_id_foreign", on_delete: :cascade
  add_foreign_key "customers", "rate_groups", name: "customers_rate_group_id_foreign"
  add_foreign_key "employee_settings", "employees", name: "employee_settings_employee_id_foreign", on_delete: :cascade
  add_foreign_key "employees", "employee_groups", name: "employees_employee_group_id_foreign"
  add_foreign_key "invoice_costgroup_distributions", "costgroups", column: "costgroup_number", primary_key: "number", name: "invoice_costgroup_distributions_costgroup_number_foreign", on_delete: :nullify
  add_foreign_key "invoice_costgroup_distributions", "invoices", name: "invoice_costgroup_distributions_invoice_id_foreign", on_delete: :cascade
  add_foreign_key "invoice_discounts", "invoices", name: "invoice_discounts_invoice_id_foreign", on_delete: :cascade
  add_foreign_key "invoice_positions", "invoices", name: "invoice_positions_invoice_id_foreign", on_delete: :cascade
  add_foreign_key "invoice_positions", "position_groups", name: "invoice_positions_position_group_id_foreign", on_delete: :nullify
  add_foreign_key "invoice_positions", "project_positions", name: "invoice_positions_project_position_id_foreign"
  add_foreign_key "invoice_positions", "rate_units", name: "invoice_positions_rate_unit_id_foreign", on_delete: :nullify
  add_foreign_key "invoices", "addresses", name: "invoices_address_id_foreign", on_delete: :nullify
  add_foreign_key "invoices", "customers", name: "invoices_customer_id_foreign", on_delete: :nullify
  add_foreign_key "invoices", "employees", column: "accountant_id", name: "invoices_accountant_id_foreign", on_delete: :nullify
  add_foreign_key "invoices", "projects", name: "invoices_project_id_foreign", on_delete: :nullify
  add_foreign_key "offer_discounts", "offers", name: "offer_discounts_offer_id_foreign", on_delete: :cascade
  add_foreign_key "offer_positions", "offers", name: "offer_positions_offer_id_foreign", on_delete: :cascade
  add_foreign_key "offer_positions", "position_groups", name: "offer_positions_position_group_id_foreign", on_delete: :nullify
  add_foreign_key "offer_positions", "rate_units", name: "offer_positions_rate_unit_id_foreign", on_delete: :nullify
  add_foreign_key "offer_positions", "services", name: "offer_positions_service_id_foreign", on_delete: :nullify
  add_foreign_key "offers", "addresses", name: "offers_address_id_foreign", on_delete: :nullify
  add_foreign_key "offers", "customers", name: "offers_customer_id_foreign", on_delete: :nullify
  add_foreign_key "offers", "employees", column: "accountant_id", name: "offers_accountant_id_foreign", on_delete: :nullify
  add_foreign_key "offers", "rate_groups", name: "offers_rate_group_id_foreign"
  add_foreign_key "phones", "customers", name: "phones_customer_id_foreign", on_delete: :cascade
  add_foreign_key "project_comments", "projects", name: "project_comments_project_id_foreign", on_delete: :cascade
  add_foreign_key "project_costgroup_distributions", "costgroups", column: "costgroup_number", primary_key: "number", name: "project_costgroup_distributions_costgroup_number_foreign", on_delete: :nullify
  add_foreign_key "project_costgroup_distributions", "projects", name: "project_costgroup_distributions_project_id_foreign", on_delete: :cascade
  add_foreign_key "project_efforts", "employees", name: "project_efforts_employee_id_foreign", on_delete: :cascade
  add_foreign_key "project_efforts", "project_positions", column: "position_id", name: "project_efforts_position_id_foreign", on_delete: :cascade
  add_foreign_key "project_positions", "position_groups", name: "project_positions_position_group_id_foreign", on_delete: :nullify
  add_foreign_key "project_positions", "projects", name: "project_positions_project_id_foreign", on_delete: :cascade
  add_foreign_key "project_positions", "rate_units", name: "project_positions_rate_unit_id_foreign", on_delete: :nullify
  add_foreign_key "project_positions", "services", name: "project_positions_service_id_foreign", on_delete: :nullify
  add_foreign_key "projects", "addresses", name: "projects_address_id_foreign", on_delete: :nullify
  add_foreign_key "projects", "customers", name: "projects_customer_id_foreign", on_delete: :nullify
  add_foreign_key "projects", "employees", column: "accountant_id", name: "projects_accountant_id_foreign", on_delete: :nullify
  add_foreign_key "projects", "offers", name: "projects_offer_id_foreign", on_delete: :nullify
  add_foreign_key "projects", "project_categories", column: "category_id", name: "projects_category_id_foreign", on_delete: :nullify
  add_foreign_key "projects", "rate_groups", name: "projects_rate_group_id_foreign"
  add_foreign_key "service_rates", "rate_groups", name: "service_rates_rate_group_id_foreign"
  add_foreign_key "service_rates", "rate_units", name: "service_rates_rate_unit_id_foreign", on_delete: :cascade
  add_foreign_key "service_rates", "services", name: "service_rates_service_id_foreign", on_delete: :cascade
  add_foreign_key "whitelisted_jwts", "employees", name: "whitelisted_jwts_employee_id_foreign", on_delete: :nullify
  add_foreign_key "work_periods", "employees", name: "work_periods_employee_id_foreign", on_delete: :cascade
end
