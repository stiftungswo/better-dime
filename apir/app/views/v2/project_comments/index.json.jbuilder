json.array! @comments do |comment|
  json.extract! comment, :id, :date, :comment, :project_id
end
