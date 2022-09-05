# frozen_string_literal: true

json.partial! "pagination", pagination: @people
json.set! :data do
  json.array! @people do |person|
    json.extract! person.decorate, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :archived, :name, :accountant_id, :rate_group_id, :salutation, :created_at, :updated_at,
                  :deleted_at
    json.company do
      if person.company
        json.extract! person.company&.decorate, :id, :type, :comment, :company_id, :department, :department_in_address, :email, :first_name, :last_name, :hidden, :archived, :name, :accountant_id, :rate_group_id, :salutation, :created_at,
                      :updated_at, :deleted_at
      end
    end
  end
end
