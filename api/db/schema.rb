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

ActiveRecord::Schema.define(version: 2019_05_14_085008) do

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

  create_table "global_settings", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "sender_name", null: false
    t.string "sender_street", null: false
    t.integer "sender_zip", null: false
    t.string "sender_phone", null: false
    t.string "sender_city", null: false
    t.string "sender_mail", null: false
    t.string "sender_vat", null: false
    t.string "sender_bank", null: false
    t.string "sender_web", null: false
    t.string "service_order_comment", null: false
    t.string "sender_bank_detail", null: false
    t.string "sender_bank_iban", null: false
    t.string "sender_bank_bic", null: false
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
  add_foreign_key "phones", "customers"
end
