# frozen_string_literal: true

require "prawn"

module Pdfs
  class EffortReportPdf < SignaturePdf
    def initialize(global_setting, data_holder, city)
      @global_setting = global_setting
      @data_holder = data_holder
      @swo_blue = "007DC2"
      @border_color = "81827e"
      super(city || data_holder.location_id)
    end

    def filename
      "Aufwandsrapport_Projekt_" + efforts_holder.id.to_s + "_" + efforts_holder.name.split(",")[0].split(";")[0]
    end

    def efforts_holder
      @data_holder
    end

    def invoice
      @invoice = Invoice.find_by_project_id(efforts_holder.id)
    end

    def is_in_range?(_date)
      # overwritten in invoice_effort_report_pdf.rb
      true
    end

    def effort_date_range(uniq_dates)
      [uniq_dates.min || DateTime.now, uniq_dates.max || DateTime.now]
    end

    def table_title(title)
      fill_color @swo_blue
      transparent(1) do
        fill_rectangle [0, cursor], bounds.width, 20
      end
      fill_color "ffffff"
      move_down 6
      indent(4, 0) do
        text title, style: :bold
      end
      fill_color "000000"
      move_down 6
    end

    def draw
      # use data_holder here so this works with both invoices and projects.
      header = Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, @data_holder, Time.current.to_date, @data_holder.accountant)

      header.draw(@default_text_settings, true)
      header.draw_title(:effort_report)

      draw_description(header)
      draw_efforts
      draw_signature(I18n.t(:signature_service_provider), I18n.t(:signature_client))
    end

    def draw_description(header)
      move_down 90

      header.draw_misc(invoice, efforts_holder, efforts_holder.offer, efforts_holder.accountant, nil, :effort_report, efforts_holder.name)

      text I18n.t(:summary) + ":", @default_text_settings.merge(style: :bold)
      text @data_holder.description, @default_text_settings
    end

    def draw_efforts
      move_down 40 if cursor > 40
      start_new_page if cursor < 60

      effort_dates = efforts_holder.project_efforts.map(&:date).uniq
      comment_dates = efforts_holder.project_comments.map(&:date).uniq
      uniq_dates = (effort_dates + comment_dates).uniq.select { |date| is_in_range?(date) }.sort

      (earliest_effort, latest_effort) = effort_date_range(uniq_dates)

      table_title(I18n.t(:services_from_to, from: earliest_effort.strftime("%d.%m.%Y"), to: latest_effort.strftime("%d.%m.%Y")))

      padding = [6, 6, 0, 6]
      table_data = [{
        data: [I18n.t(:date_name), I18n.t(:description), I18n.t(:quantity), I18n.t(:unit)],
        style: {
          font_style: :bold,
          height: 36,
          padding: padding,
          border_color: @border_color,
          borders: [:bottom],
          border_width: 0.5,
          valign: :center
        }
      }]

      content_widths = [bounds.width - 180, 50, 55]
      widths = [75] + content_widths

      uniq_dates.each do |date|
        date_data = []
        num_comments = efforts_holder.project_comments.count { |e| e.date == date }

        efforts_holder.project_comments.select { |e| e.date == date }.each do |comment|
          date_data.push([comment.comment, "", ""])
        end

        efforts_holder.project_efforts.select { |e| e.date == date }.uniq(&:position_id).each do |effort|
          same_positions = efforts_holder.project_efforts.select { |e| e.date == date && e.position_id == effort.position_id }
          date_data.push [
            effort.project_position.service.name,
            (same_positions.inject(0) { |sum, e| sum + e.value } / effort.project_position.rate_unit.factor).round(2),
            effort.project_position.rate_unit.name
          ]
        end

        subtable = make_table(date_data, column_widths: content_widths) do
          cells.borders = []
          columns(1).align = :right

          rows(0..date_data.length - 1).padding = [3, 6, 3, 6]
          row(0).padding_top = 6

          rows(0..num_comments - 1).font_style = :italic if num_comments > 0
        end

        table_data.push(
          data: [date.strftime("%d.%m.%Y"), { content: subtable, colspan: 3 }],
          style: {
            padding_bottom: 4,
            padding_top: 1,
            border_color: @border_color,
            borders: [:bottom],
            border_width: 0.5,
            valign: :center
          }
        )
      end

      Pdfs::Generators::TableGenerator.new(@document).render(
        table_data,
        widths,
        {
          [2] => :right
        },
        true
      )
    end
  end
end
