require 'prawn'

module Pdfs
  class OfferPdf < BasePdf
    def initialize(global_setting, offer)
      @global_setting = global_setting
      @offer = offer
      super()
    end

    def data
      @offer
    end

    def draw
      Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, @offer).draw @default_text_settings
      draw_description
      draw_breakdown
      draw_signature
    end

    def draw_description
      move_down 10
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings
      text "Sachbearbeiter: " + @offer.accountant.full_name, @default_text_settings

      move_down 20
      text "Offerte: ".upcase + @offer.name.upcase, @default_text_settings.merge(:size => 13, :style => :bold)
      text "Leistungsangebot Nr. " + @offer.id.to_s, @default_text_settings

      move_down 20
      Redcarpet::Markdown.new(Pdfs::Markdown::PdfRenderer.new document, @spacing, @leading).render(@offer.description)
    end

    def draw_breakdown
      move_down 10
      dash(1, :space => 2)
      stroke_horizontal_rule
      undash
      move_down 20

      text "Kostenübersicht".upcase, @default_text_settings.merge(:style => :bold, size: 12)

      Pdfs::Generators::BreakdownTableGenerator.new(document, @offer.breakdown).render(
        ["Position", "Ansatz CHF", "Einheit", "Anzahl", "MwSt.", "Teilbetrag CHF exkl. MwSt."]
      )
    end

    def draw_signature
      move_down 20
      text "Bitte unterschrieben retournieren bis " + (Time.current + 1.month + 1.day).to_date.strftime("%d.%m.%Y"), @default_text_settings.merge(:style => :bold)
      move_down 20

      float do
        text "Unterschrift des Auftragsnehmers:", @default_text_settings.merge(:style => :bold)
      end
      indent(bounds.width/2.0, 0) do
        text "Unterschrift des Auftraggebers:", @default_text_settings.merge(:style => :bold)
      end

      move_down 35

      float do
        text "Ort / Datum:", @default_text_settings
      end
      indent(bounds.width/2.0, 0) do
        text "Ort / Datum:", @default_text_settings
      end

      move_down 30

      bounding_box([0, cursor], :width => bounds.width, :height => 20) do
        float do
          text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings
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
