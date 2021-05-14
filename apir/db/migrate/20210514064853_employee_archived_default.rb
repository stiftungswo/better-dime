class EmployeeArchivedDefault < ActiveRecord::Migration[6.0]
  def change
    change_column_default :employees, :archived, from: nil, to: false
  end
end
