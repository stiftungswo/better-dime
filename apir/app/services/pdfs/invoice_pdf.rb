# frozen_string_literal: true

require "prawn"

module Pdfs
  class InvoicePdf < BasePdf
    def initialize(global_setting, invoice, date)
      @global_setting = global_setting
      @invoice = invoice
      @date = date
      super()
    end

    def filename
      "Rechnung_#{@invoice.id}_#{@invoice.name.split(",")[0].split(";")[0]}_#{@date.strftime("%Y_%m_%d")}"
    end

    def draw
      header = Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, @invoice, @date, @invoice.accountant)

      header.draw(@default_text_settings, true)
      header.draw_title(:invoice)

      draw_description(header)
      draw_breakdown
    end

    def draw_description(header)
      move_down 90

      project = @invoice.project
      costgroup_sums = @invoice.project.costgroup_sums
      costgroups_sum = @invoice.project.costgroups_sum

      costgroups = @invoice.invoice_costgroup_distributions.map do |costgroup|
        "#{project.costgroup_distribution(costgroup.costgroup_number).round}% #{costgroup.costgroup_number}"
      end
      costgroups << "#{project.missing_costgroup_distribution.round} % -" if project.is_costgroup_dist_incomplete?
      costgroups = costgroups.join(", ")

      header.draw_misc(@invoice, @invoice.project, @invoice.project.offer, @invoice.accountant, costgroups, :invoice, @invoice.name,
                       "#{@invoice.beginning.strftime("%d.%m.%Y")} - #{@invoice.ending.strftime("%d.%m.%Y")}")

      move_down 25
      Redcarpet::Markdown.new(Pdfs::Markdown::PdfRenderer.new(document, @spacing, @leading))
                         .render((@invoice.description[0] == "#" ? "" : "##{I18n.t(:project_description)}\n") + @invoice.description)
    end

    def draw_breakdown
      Pdfs::Generators::BreakdownTableGenerator.new(document, @invoice.breakdown).render(
        [I18n.t(:position), I18n.t(:price_per_unit_chf), I18n.t(:unit), I18n.t(:quantity), I18n.t(:vat), I18n.t(:subtotal_chf_excl_vat)]
      )
      move_down 10
      text I18n.t(:payable_deadline, days: 30), @default_text_settings
    end
  end
end
