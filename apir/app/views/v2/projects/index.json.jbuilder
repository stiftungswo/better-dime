# json.partial! 'pagination', pagination: $offers
json.partial! 'pagination', pagination: @projects
json.set! :data do
  json.array! @projects do |project|
    json.extract! project.decorate, :id, :archived, :description, :name
    json.deletable @invoices_counts[project.id].blank? && @positions_counts[project.id].to_i == 0
  end
end
