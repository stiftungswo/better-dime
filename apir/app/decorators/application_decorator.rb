class ApplicationDecorator < Draper::Decorator
  # Define methods for all decorated objects.
  # Helpers are accessed through `helpers` (aka `h`). For example:
  #
  #   def percent_amount
  #     h.number_to_percentage object.amount, precision: 2
  #   end

  # Make React happy
  def created_at
    model.created_at&.to_formatted_s(:db)
  end

  def updated_at
    model.updated_at&.to_formatted_s(:db)
  end
end
