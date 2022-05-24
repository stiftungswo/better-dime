# frozen_string_literal: true

require "prawn"

module Pdfs
  class SignaturePdf < BasePdf
    def initialize(city)
      @signature_city = city if city and city.match? /\A[a-zA-Z]{1,20}\z/
      # if city is an integer string, use it as an id instead.
      city_id = Integer(city, exception: false)
      @signature_city = Location.find(city_id).url if city_id
      super()
    end

    def draw_signature(left_heading, right_heading)
      start_new_page if cursor < 90

      bounding_box([0, 90], width: bounds.width, height: 150) do
        float do
          indent(10, 0) do
            text left_heading, @default_text_settings.merge(size: 10, style: :bold)
          end
        end

        indent(bounds.width / 2.0 + 50, 0) do
          text right_heading, @default_text_settings.merge(size: 10, style: :bold)
        end

        move_down 10

        bounding_box([10, cursor], width: bounds.width / 2.0 - 75, height: 60) do
          if @signature_city.present? then
            text @signature_city + ", " + Time.now.to_date.strftime("%d.%m.%Y"), @default_text_settings.merge(size: 12)
          else
            move_down 16
          end
          stroke_horizontal_rule
          move_down 4
          text I18n.t(:place) + " / " + I18n.t(:date_name), @default_text_settings
          move_down 14
          stroke_horizontal_rule
          move_down 4
          text I18n.t(:signature), @default_text_settings
        end

        move_up 45

        bounding_box([bounds.width / 2.0 + 50, cursor], width: bounds.width / 2.0 - 75, height: 44) do
          stroke_horizontal_rule
          move_down 4
          text I18n.t(:place) + " / " + I18n.t(:date_name), @default_text_settings
          move_down 14
          stroke_horizontal_rule
          move_down 4
          text I18n.t(:signature), @default_text_settings
        end
      end
    end
  end
end
