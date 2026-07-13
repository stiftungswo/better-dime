# frozen_string_literal: true

class AddStreetNumberToAddressesAndGlobalSettings < ActiveRecord::Migration[8.0]
  def up
    add_column :addresses, :street_number, :string, null: true
    add_column :global_settings, :sender_street_number, :string, null: true

    Address.find_each do |a|
      m = a.street.match(/\A(.*?)\s+(\d[\w]*)\z/)
      a.update_columns(street: m[1], street_number: m[2]) if m
    end

    GlobalSetting.find_each do |gs|
      m = gs.sender_street.match(/\A(.*?)\s+(\d[\w]*)\z/)
      gs.update_columns(sender_street: m[1], sender_street_number: m[2]) if m
    end
  end

  def down
    Address.find_each do |a|
      a.update_columns(street: [a.street, a.street_number].compact.join(" "))
    end

    GlobalSetting.find_each do |gs|
      gs.update_columns(sender_street: [gs.sender_street, gs.sender_street_number].compact.join(" "))
    end

    remove_column :addresses, :street_number
    remove_column :global_settings, :sender_street_number
  end
end
