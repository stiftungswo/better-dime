# frozen_string_literal: true

require "prawn"

module Pdfs
  class InvoicePdf < BasePdf
    def initialize(global_setting, invoice)
      @global_setting = global_setting
      @invoice = invoice
      super()
    end

    def filename
      "Rechnung_" + @invoice.id.to_s + "_" + @invoice.name.split(",")[0].split(";")[0] + "_" + @invoice.ending.strftime("%Y_%m_%d")
    end

    def draw
      header = Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, @invoice, Time.current.to_date, @invoice.accountant)

      header.draw(@default_text_settings, true)
      header.draw_title(:invoice)

      draw_description(header)
      draw_breakdown
    end

    def draw_description(header)
      move_down 70

      costgroups = @invoice.invoice_costgroup_distributions.map do |costgroup|
        costgroup.weight_percent.round.to_s + "% " + costgroup.costgroup_number.to_s
      end.join(", ")

      header.draw_misc(@invoice, @invoice.project, @invoice.project.offer, @invoice.accountant, costgroups, :invoice, @invoice.name)

      move_down 25
      Redcarpet::Markdown.new(Pdfs::Markdown::PdfRenderer.new(document, @spacing, @leading))
        .render((@invoice.description[0] == '#' ? "" : "#Projektbeschrieb\n") + @invoice.description)
    end

    def draw_breakdown
      move_down 40 if cursor > 40
      start_new_page if cursor < 100
      Pdfs::Generators::BreakdownTableGenerator.new(document, @invoice.breakdown).render(
        [I18n.t(:position), I18n.t(:price_per_unit_chf), I18n.t(:unit), I18n.t(:quantity), I18n.t(:vat), I18n.t(:subtotal_chf_excl_vat)]
      )
      move_down 10
      text I18n.t(:payable_deadline, days: 30), @default_text_settings
    end
  end
end
