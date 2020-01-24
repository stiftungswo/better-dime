json.partial! 'pagination', pagination: @employees
json.set! :data do
  json.array! @employees do |user|
    json.extract! user, :id, :first_name, :last_name, :email
  end
end
