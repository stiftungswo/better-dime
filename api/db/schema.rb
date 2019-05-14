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

ActiveRecord::Schema.define(version: 2019_05_14_114726) do

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
    t.index ["customer_id"], name: "index_addresses_on_customer_id"
  end

  create_table "cost_groups", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "number", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["number"], name: "index_cost_groups_on_number", unique: true
  end

  create_table "customers", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "type", null: false
    t.text "comment"
    t.string "department"
    t.bigint "customers_id"
    t.string "email"
    t.string "first_name"
    t.string "last_name"
    t.boolean "hidden", default: false, null: false
    t.string "name"
    t.bigint "rate_group_id"
    t.string "salutation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customers_id"], name: "index_customers_on_customers_id"
    t.index ["name"], name: "index_customers_on_name"
    t.index ["rate_group_id"], name: "index_customers_on_rate_group_id"
  end

  create_table "employee_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "employees", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "email"
    t.boolean "admin"
    t.string "first_name"
    t.string "last_name"
    t.boolean "can_login"
    t.boolean "archived"
    t.integer "holidays_per_year"
    t.bigint "employee_group_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  end

  create_table "holidays", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.date "date", null: false
    t.integer "duration", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "invoice_cost_group_distributions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "cost_group_id"
    t.integer "weight"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "invoice_id"
    t.index ["cost_group_id"], name: "fk_rails_ca9de3cea7"
    t.index ["invoice_id"], name: "index_invoice_cost_group_distributions_on_invoice_id"
  end

  create_table "invoice_discounts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "invoice_id"
    t.string "name"
    t.boolean "percentage"
    t.decimal "value", precision: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invoice_id"], name: "index_invoice_discounts_on_invoice_id"
  end

  create_table "invoices", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "employee_id"
    t.bigint "customer_id"
    t.bigint "address_id"
    t.text "description"
    t.date "ending"
    t.date "beginning"
    t.integer "fixed_price"
    t.string "name"
    t.decimal "fixed_price_vat", precision: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["address_id"], name: "index_invoices_on_address_id"
    t.index ["customer_id"], name: "index_invoices_on_customer_id"
    t.index ["employee_id"], name: "index_invoices_on_employee_id"
  end

  create_table "phones", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "number"
    t.integer "category"
    t.bigint "customer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_phones_on_customer_id"
  end

  create_table "rate_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "description", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "addresses", "customers"
  add_foreign_key "customers", "customers", column: "customers_id"
  add_foreign_key "customers", "rate_groups"
  add_foreign_key "employees", "employee_groups"
  add_foreign_key "invoice_cost_group_distributions", "cost_groups", primary_key: "number"
  add_foreign_key "invoice_cost_group_distributions", "invoices"
  add_foreign_key "invoice_discounts", "invoices"
  add_foreign_key "invoices", "addresses"
  add_foreign_key "invoices", "customers"
  add_foreign_key "invoices", "employees"
  add_foreign_key "phones", "customers"
end
