# frozen_string_literal: true

module Pdfs
  module Generators
    class MailHeaderGenerator
      def initialize(document, global_setting, data)
        @document = document
        @global_setting = global_setting
        @data = data
        @logo_offset = 70
        @address_offset = @logo_offset
        @logo_width = 180
      end

      def draw(text_settings, draw_recipient = true)
        @default_text_settings = text_settings

        @address_offset = 0 unless draw_recipient

        draw_logo
        draw_sender_address
        draw_recipient_address if draw_recipient
      end

      private

      def draw_logo
        @document.bounding_box([@document.bounds.width - @logo_width, @document.bounds.height], width: @logo_width, height: @logo_offset) do
          # @document.stroke_bounds

          image_path = Rails.root.join("app", "assets", "logo", "logo.png")

          @document.move_up 15
          @document.image image_path, width: @logo_width
        end
      end

      def draw_sender_address
        @document.bounding_box([0, @document.bounds.height - @address_offset], width: 200, height: 100) do
          # @document.stroke_bounds

          @document.text @global_setting.sender_name, @default_text_settings
          @document.text @global_setting.sender_street, @default_text_settings
          @document.text @global_setting.sender_zip + " " + @global_setting.sender_city, @default_text_settings
          @document.text "Telefon: " + @global_setting.sender_phone, @default_text_settings
          @document.text "Mail: " + @global_setting.sender_mail, @default_text_settings
          @document.text @global_setting.sender_web, @default_text_settings
        end
      end

      def draw_recipient_address
        @document.bounding_box([@document.bounds.width - 175, @document.bounds.height - @logo_offset], width: 175, height: 100) do
          # stroke_bounds

          @document.text @data.customer.company.name, @default_text_settings if @data.customer.company
          @document.text @data.customer.department, @default_text_settings if @data.customer.department && @data.customer.department_in_address
          @document.text (@data.customer.salutation || "") + " " + @data.customer.full_name, @default_text_settings
          @document.text @data.address.street + " " + (@data.address.supplement || ""), @default_text_settings
          @document.text @data.address.zip.to_s + " " + @data.address.city, @default_text_settings
        end
      end
    end
  end
end
