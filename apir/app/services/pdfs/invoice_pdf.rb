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
      text I18n.t(:clerk) + ": " + @invoice.accountant.full_name, @default_text_settings

      costgroups = @invoice.invoice_costgroup_distributions.map do |costgroup|
        costgroup.weight_percent.round.to_s + "% " + costgroup.costgroup_number.to_s
      end.join(", ")

      move_down 20
      text I18n.t(:invoice).upcase + ": ".upcase + @invoice.name.upcase, @default_text_settings.merge(size: 13, style: :bold)
      move_down 5
      text_box I18n.t(:offer) + " Nr. " + @invoice.project.offer.id.to_s, @default_text_settings.merge(at: [150, cursor]) if @invoice.project.offer
      text_box I18n.t(:vat) + "-ID " + @global_setting.sender_vat, @default_text_settings.merge(at: [@invoice.project.offer.nil? ? 150 : 300, cursor])
      text I18n.t(:invoice) + " Nr. " + @invoice.id.to_s, @default_text_settings
      text_box I18n.t(:cost_groups) + " " + costgroups, @default_text_settings.merge(at: [150, cursor])
      text I18n.t(:project) + " Nr. " + @invoice.project.id.to_s, @default_text_settings

      move_down 25
      Redcarpet::Markdown.new(Pdfs::Markdown::PdfRenderer.new(document, @spacing, @leading)).render(@invoice.description)
    end

    def draw_breakdown
      move_down 10

      Pdfs::Generators::BreakdownTableGenerator.new(document, @invoice.breakdown).render(
        [I18n.t(:position), I18n.t(:price_per_unit_chf), I18n.t(:unit), I18n.t(:quantity), I18n.t(:vat), I18n.t(:subtotal_chf_excl_vat)]
      )
      text I18n.t(:payable_deadline, days: 30), @default_text_settings
    end
  end
end
