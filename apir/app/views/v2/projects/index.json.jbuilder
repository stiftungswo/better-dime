# frozen_string_literal: true

# json.partial! 'pagination', pagination: $offers
json.partial! "pagination", pagination: @projects
json.set! :data do
  json.array! @projects do |project|
    json.extract! project.decorate, :id, :archived, :description, :name, :listing_name, :updated_at
    json.deletable @invoices_counts[project.id].blank? && @positions_counts[project.id].to_i == 0
  end
end
