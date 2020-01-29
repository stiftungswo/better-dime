# json.partial! 'pagination', pagination: $offers
json.partial! 'pagination', pagination: @projects
json.set! :data do
  json.array! @projects do |project|
    json.extract! project.decorate, :id, :archived, :description, :name
  end
end
