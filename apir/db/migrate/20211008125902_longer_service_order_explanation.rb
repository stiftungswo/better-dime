class LongerServiceOrderExplanation < ActiveRecord::Migration[6.0]
  def up
      change_column :global_settings, :service_order_comment, :text
  end

  def down
      change_column :global_settings, :service_order_comment, :string
  end
end
