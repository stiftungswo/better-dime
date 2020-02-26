# frozen_string_literal: true

require "prawn"

module Pdfs
  class InvoicePdf < BasePdf
    def initialize(global_setting, invoice)
      @global_setting = global_setting
      @invoice = invoice
      super()
    end

    def draw
      Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, @invoice).draw @default_text_settings
      draw_description
      draw_breakdown
    end

    def draw_description
      move_down 10
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings
      text "Sachbearbeiter: " + @invoice.accountant.full_name, @default_text_settings

      costgroups = @invoice.invoice_costgroup_distributions.map do |costgroup|
        costgroup.weight_percent.round.to_s + "% " + costgroup.costgroup_number.to_s
      end.join(", ")

      move_down 20
      text "Rechnung: ".upcase + @invoice.name.upcase, @default_text_settings.merge(size: 13, style: :bold)
      move_down 5
      text_box "Offerte Nr. " + @invoice.project.offer.id.to_s, @default_text_settings.merge(at: [150, cursor]) if @invoice.project.offer
      text_box "MwSt.-ID " + @global_setting.sender_vat, @default_text_settings.merge(at: [@invoice.project.offer.nil? ? 150 : 300, cursor])
      text "Rechnung Nr. " + @invoice.id.to_s, @default_text_settings
      text_box "Kostenstellen " + costgroups, @default_text_settings.merge(at: [150, cursor])
      text "Projekt Nr. " + @invoice.project.id.to_s, @default_text_settings

      move_down 25
      Redcarpet::Markdown.new(Pdfs::Markdown::PdfRenderer.new(document, @spacing, @leading)).render(@invoice.description)
    end

    def draw_breakdown
      move_down 10

      Pdfs::Generators::BreakdownTableGenerator.new(document, @invoice.breakdown).render(
        ["Bezeichnung", "Ansatz CHF", "Einheit", "Anzahl", "MwSt.", "Teilbetrag CHF exkl. MwSt."]
      )
      text "Zahlbar 30 Tage netto", @default_text_settings
    end
  end
end
