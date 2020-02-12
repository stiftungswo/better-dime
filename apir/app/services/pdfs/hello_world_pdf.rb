require 'prawn'

module Pdfs
  class HelloWorldPdf
    include Prawn::View
    include Pdfs::PrawnHelper

    def initialize(global_setting, offer)
      @global_setting = global_setting
      @offer = offer
      @spacing = 0.5
      @leading = 3

      update_font_families
      font "RobotoCondensed", style: :light, size: 10
      draw_sender_address
      draw_recipient_address
    end

    def document
      @document ||= Prawn::Document.new(page_size: 'A4', page_layout: :portrait)
      @document
    end

    def draw_sender_address
      stroke_axis
      bounding_box([18, 730], :width => 250, :height => 100) do
        # stroke_bounds

        text @global_setting.sender_name, :character_spacing => @spacing, :leading => @leading
        text @global_setting.sender_street, :character_spacing => @spacing, :leading => @leading
        text @global_setting.sender_zip + " " + @global_setting.sender_city, :character_spacing => @spacing, :leading => @leading
        text "Telefon: " + @global_setting.sender_phone, :character_spacing => @spacing, :leading => @leading
        text "Mail: " + @global_setting.sender_mail, :character_spacing => @spacing, :leading => @leading
        text @global_setting.sender_web, :character_spacing => @spacing, :leading => @leading
      end
    end

    def draw_recipient_address
      stroke_axis
      bounding_box([325, 730], :width => 250, :height => 100) do
        # stroke_bounds

        if @offer.customer.company
          text @offer.customer.company.name, :character_spacing => @spacing, :leading => @leading
        end

        text @offer.customer.salutation + " " + @offer.customer.full_name, :character_spacing => @spacing, :leading => @leading
        text @offer.address.street + " " + (@offer.address.supplement || ""), :character_spacing => @spacing, :leading => @leading
        text @offer.address.zip.to_s + " " + @offer.address.city, :character_spacing => @spacing, :leading => @leading
      end
    end
  end
end
