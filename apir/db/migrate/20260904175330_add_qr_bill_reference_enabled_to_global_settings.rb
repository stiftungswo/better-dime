# frozen_string_literal: true

class AddQrBillReferenceEnabledToGlobalSettings < ActiveRecord::Migration[8.0]
  def change
    add_column :global_settings, :qr_bill_reference_enabled, :boolean, default: false, null: false
  end
end
