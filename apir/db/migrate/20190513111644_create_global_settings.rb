class CreateGlobalSettings < ActiveRecord::Migration[5.2]
  def change
    create_table :global_settings do |t|
      t.string :sender_name, null: false, default: 'Example Company'
      t.string :sender_street, null: false, default: 'Test street 1'
      t.integer :sender_zip, null: false, default: 1234
      t.string :sender_phone, null: false, default: '044 333 44 55'
      t.string :sender_city, null: false, default: 'Zürich'
      t.string :sender_mail, null: false, default: 'dime@example.com'
      t.string :sender_vat, null: false, default: 'CHE-123.456.543'
      t.string :sender_bank, null: false, default: '07-007-07'
      t.string :sender_web, null: false, default: 'https://github.com/stiftungswo/betterDime'
      t.string :service_order_comment, null: false, default: ''
      t.string :sender_bank_detail, null: false, default: 'Example Bank, 0000 Example'
      t.string :sender_bank_iban, null: false, default: 'CH9300762011623852957'
      t.string :sender_bank_bic, null: false, default: 'EXABANK00000'

      t.timestamps
    end
  end
end
