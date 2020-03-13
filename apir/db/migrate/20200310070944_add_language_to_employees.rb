class AddLanguageToEmployees < ActiveRecord::Migration[6.0]
  def change
    change_table :employees do |t|
      t.string :locale, null: false, default: 'de'
    end
  end
end
