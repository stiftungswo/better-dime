# frozen_string_literal: true

class AddDeviseToEmployees < ActiveRecord::Migration[5.2]
  def self.up
    change_table :employees do |t|
      t.string :encrypted_password, null: false, default: ''
      t.datetime :remember_created_at
    end

    add_index :employees, :email, unique: true
  end

  def self.down
    remove_column :employees, :encrypted_password
    remove_column :employees, :remember_created_at
    remove_index :employees, :email
  end
end
