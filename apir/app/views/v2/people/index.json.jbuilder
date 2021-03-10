# frozen_string_literal: true

json.partial! "pagination", pagination: @people
json.set! :data do
  json.array! @people do |person|
    json.extract! person.decorate, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name, :accountant_id, :rate_group_id, :salutation, :newsletter, :biodiversity_course, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
    json.company do
      if person.company
        json.extract! person.company&.decorate, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :name, :accountant_id, :rate_group_id, :salutation, :newsletter, :biodiversity_course, :created_at, :updated_at, :deleted_at, :created_by, :updated_by, :deleted_by
      end
    end
  end
end
