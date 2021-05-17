class EmployeeFirstVactaionTakeoverDefault < ActiveRecord::Migration[6.0]
  def change
    change_column_default :employees, :first_vacation_takeover, 0
  end
end
