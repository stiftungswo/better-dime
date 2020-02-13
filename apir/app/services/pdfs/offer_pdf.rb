require 'prawn'

module Pdfs
  class OfferPdf
    include Prawn::View
    include Pdfs::PrawnHelper

    def initialize(global_setting, offer)
      @global_setting = global_setting
      @offer = offer
      @spacing = 0.25
      @leading = 3
      @logo_offset = 100
      @page_width = 480
      @page_height = 700

      update_font_families
      font "Helvetica", style: :normal, size: 10

      # stroke_axis

      bounding_box(
        [(bounds.width-@page_width)/2.0, bounds.height-(bounds.height-@page_height)/2.0],
        :width => @page_width,
        :height => @page_height
      ) do
        # stroke_axis

        draw_sender_address
        draw_recipient_address
        draw_description
        draw_breakdown
        draw_signature
      end
    end

    def document
      @document ||= Prawn::Document.new(page_size: 'A4', page_layout: :portrait)
      @document
    end

    def draw_sender_address
      bounding_box([0, bounds.height - @logo_offset], :width => 200, :height => 100) do
        #stroke_bounds

        text @global_setting.sender_name, :character_spacing => @spacing, :leading => @leading
        text @global_setting.sender_street, :character_spacing => @spacing, :leading => @leading
        text @global_setting.sender_zip + " " + @global_setting.sender_city, :character_spacing => @spacing, :leading => @leading
        text "Telefon: " + @global_setting.sender_phone, :character_spacing => @spacing, :leading => @leading
        text "Mail: " + @global_setting.sender_mail, :character_spacing => @spacing, :leading => @leading
        text @global_setting.sender_web, :character_spacing => @spacing, :leading => @leading
      end
    end

    def draw_recipient_address
      bounding_box([bounds.width-175, bounds.height - @logo_offset], :width => 175, :height => 100) do
        #stroke_bounds

        if @offer.customer.company
          text @offer.customer.company.name, :character_spacing => @spacing, :leading => @leading
        end

        text @offer.customer.salutation + " " + @offer.customer.full_name, :character_spacing => @spacing, :leading => @leading
        text @offer.address.street + " " + (@offer.address.supplement || ""), :character_spacing => @spacing, :leading => @leading
        text @offer.address.zip.to_s + " " + @offer.address.city, :character_spacing => @spacing, :leading => @leading
      end
    end

    def draw_description
      move_down 10
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), :character_spacing => @spacing, :leading => @leading
      text "Sachbearbeiter: " + @offer.accountant.full_name, :character_spacing => @spacing, :leading => @leading

      move_down 20
      text "Offerte: ".upcase + @offer.name.upcase, :size => 13, :style => :bold, :character_spacing => @spacing, :leading => @leading
      text "Leistungsangebot Nr. " + @offer.id.to_s, :style => :normal, :character_spacing => @spacing, :leading => @leading

      move_down 20
      Redcarpet::Markdown.new(Pdfs::Markdown::PdfRenderer.new document, @spacing, @leading).render(@offer.description)
    end

    def draw_breakdown
      move_down 10
      dash(1, :space => 2)
      stroke_horizontal_rule
      undash
      move_down 20

      text "Kostenübersicht".upcase, size: 12, :style => :bold, :character_spacing => @spacing, :leading => @leading

      BreakdownTableGenerator.new(document, @offer.breakdown).render
    end

    def draw_signature
      move_down 20
      text "Bitte unterschrieben retournieren bis " + (Time.current + 1.month + 1.day).to_date.strftime("%d.%m.%Y"), :style => :bold, :character_spacing => @spacing, :leading => @leading
      move_down 20

      float do
        text "Unterschrift des Auftragsnehmers:", :style => :bold, :character_spacing => @spacing, :leading => @leading
      end
      indent(bounds.width/2.0, 0) do
        text "Unterschrift des Auftraggebers:", :style => :bold, :character_spacing => @spacing, :leading => @leading
      end

      move_down 35

      float do
        text "Ort / Datum:", :character_spacing => @spacing, :leading => @leading
      end
      indent(bounds.width/2.0, 0) do
        text "Ort / Datum:", :character_spacing => @spacing, :leading => @leading
      end

      move_down 30

      bounding_box(
        [0, cursor],
        :width => bounds.width,
        :height => 20
      ) do
        float do
          text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), :character_spacing => @spacing, :leading => @leading
        end

        indent(bounds.width/2.0, 0) do
          move_down 9
          dash(1, :space => 1)
          stroke_horizontal_rule
          undash
        end
      end
    end
  end
end
