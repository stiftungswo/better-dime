# frozen_string_literal: true

require "prawn"

module Pdfs
  class EffortReportPdf < BasePdf
    def initialize(global_setting, data_holder)
      @global_setting = global_setting
      @data_holder = data_holder
      super()
    end

    def efforts_holder
      @data_holder
    end

    def invoice
      @invoice = Invoice.find_by_project_id(efforts_holder.id)
    end

    def draw
      header = Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, efforts_holder)

      header.draw(@default_text_settings, true)
      header.draw_title(:effort_report)

      draw_description(header)
      draw_efforts
      draw_signature
    end

    def draw_description(header)

      move_down 70

      costgroups = efforts_holder.project_costgroup_distributions.map do |c|
        c.weight.to_s + "% " + c.costgroup_number.to_s
      end.join(", ")

      header.draw_misc(invoice, efforts_holder, efforts_holder.offer, efforts_holder.accountant, costgroups, :effort_report, efforts_holder.name)
    end

    def draw_efforts
      move_down 40 if cursor > 40
      start_new_page if cursor < 60

      Pdfs::Generators::BreakdownTableGenerator.new(document, efforts_holder.breakdown, true).render(
        [I18n.t(:position), I18n.t(:price_per_unit_chf), I18n.t(:unit), I18n.t(:quantity), I18n.t(:vat), I18n.t(:subtotal_chf_excl_vat)]
      )
    end

    def draw_signature
      start_new_page if cursor < 100

      bounding_box([0, 70], width: bounds.width, height: 150) do
        float do
          indent(10, 0) do
            text I18n.t(:signature_service_provider), @default_text_settings.merge(size: 10, style: :bold)
          end
        end

        indent(bounds.width / 2.0 + 50, 0) do
          text I18n.t(:signature_client), @default_text_settings.merge(size: 10, style: :bold)
        end

        move_down 50

        bounding_box([10, cursor], width: bounds.width / 2.0 - 75, height: 20) do
            stroke_horizontal_rule
            move_down 4
            text I18n.t(:place) + " / " + I18n.t(:date_name), @default_text_settings
        end

        move_up 20

        bounding_box([bounds.width / 2.0 + 50, cursor], width: bounds.width / 2.0 - 75, height: 20) do
          stroke_horizontal_rule
          move_down 4
          text I18n.t(:place) + " / " + I18n.t(:date_name), @default_text_settings
        end
      end
    end
  end
end
