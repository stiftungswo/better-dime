class WorkPeriodHourlyPaidDefault < ActiveRecord::Migration[6.0]
  def change
    change_column_default :work_periods, :hourly_paid, from: nil, to: false
  end
end
