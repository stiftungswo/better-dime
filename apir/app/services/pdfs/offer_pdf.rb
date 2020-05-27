# frozen_string_literal: true

require "prawn"

module Pdfs
  class OfferPdf < BasePdf
    def initialize(global_setting, offer)
      @global_setting = global_setting
      @offer = offer
      super()
    end

    def filename
      "Offerte_" + @offer.id.to_s + "_" + @offer.name.split(",")[0].split(";")[0] + "_" + @offer.created_at.strftime("%Y_%m_%d")
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
      text I18n.t(:clerk) + ": " + @offer.accountant.full_name, @default_text_settings

      move_down 20
      text I18n.t(:offer) + ": " + @offer.name, @default_text_settings.merge(size: 14, style: :bold)
      text I18n.t(:range_of_services) + " Nr. " + @offer.id.to_s, @default_text_settings

      move_down 20
      Redcarpet::Markdown.new(Pdfs::Markdown::PdfRenderer.new(document, @spacing, @leading)).render(@offer.description)
    end

    def draw_breakdown
      start_new_page
      text I18n.t(:cost_overview), @default_text_settings.merge(style: :bold, size: 12)

      Pdfs::Generators::BreakdownTableGenerator.new(document, @offer.breakdown).render(
        [I18n.t(:position), I18n.t(:price_per_unit_chf), I18n.t(:unit), I18n.t(:quantity), I18n.t(:vat), I18n.t(:subtotal_chf_excl_vat)]
      )
    end

    def draw_signature
      start_new_page if cursor < 150

      move_down 20
      text I18n.t(:return_signed_until) + " " + (Time.current + 1.month + 1.day).to_date.strftime("%d.%m.%Y"), @default_text_settings.merge(style: :bold)
      move_down 20

      float do
        text I18n.t(:signature_contractor) + ":", @default_text_settings.merge(style: :bold)
      end
      indent(bounds.width / 2.0, 0) do
        text I18n.t(:signature_client) + ":", @default_text_settings.merge(style: :bold)
      end

      move_down 35

      float do
        text I18n.t(:place) + " / " + I18n.t(:date_name) + ":", @default_text_settings
      end
      indent(bounds.width / 2.0, 0) do
        text I18n.t(:place) + " / " + I18n.t(:date_name) + ":", @default_text_settings
      end

      move_down 30

      bounding_box([0, cursor], width: bounds.width, height: 20) do
        float do
          text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings
        end

        indent(bounds.width / 2.0, 0) do
          move_down 9
          dash(1, space: 1)
          stroke_horizontal_rule
          undash
        end
      end
    end
  end
end
