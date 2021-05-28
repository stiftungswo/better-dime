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

    def subtitle
      I18n.t(:project) + " Nr. " + efforts_holder.id.to_s
    end

    def draw
      Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, efforts_holder).draw(
        @default_text_settings,
        false
      )
      draw_description
      draw_efforts
    end

    def draw_description
      move_down 40
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings

      dates = efforts_holder.project_efforts.map(&:date) + efforts_holder.project_comments.map(&:date)

      earliest_effort = dates.min || DateTime.now
      latest_effort = dates.max || DateTime.now

      move_down 5
      text I18n.t(:effort_report) + ": " + efforts_holder.name, @default_text_settings.merge(size: 14, style: :bold)
      text subtitle, @default_text_settings.merge(style: :bold)
      text I18n.t(:services_from_to, from: earliest_effort.strftime("%d.%m.%Y"), to: latest_effort.strftime("%d.%m.%Y")), @default_text_settings

      move_down 15
      text I18n.t(:summary) + ":", @default_text_settings.merge(style: :bold)
      text efforts_holder.description, @default_text_settings
    end

    def draw_efforts
      move_down 20

      effort_dates = efforts_holder.project_efforts.map(&:date).uniq
      comment_dates = efforts_holder.project_comments.map(&:date).uniq
      uniq_dates = (effort_dates + comment_dates).uniq.sort

      table_data = [
        [I18n.t(:date_name), I18n.t(:description), I18n.t(:quantity), I18n.t(:unit)]
      ]

      content_widths = [bounds.width - 190, 50, 65]
      widths = [75] + content_widths

      uniq_dates.each do |date|
        date_data = []
        num_comments = efforts_holder.project_comments.count { |e| e.date == date }

        efforts_holder.project_comments.select { |e| e.date == date }.each do |comment|
          date_data.push [
            comment.comment,
            "",
            ""
          ]
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
          # pad the cells on top, right and bottom
          columns(0..date_data[0].length - 2).padding = [3, 10, 3, 0]
          # only have a very small right padding on the right most cell
          columns(date_data[0].length - 1).padding = [3, 1, 3, 0]
          columns(1).align = :right

          rows(0..num_comments - 1).font_style = :italic if num_comments > 0
        end

        table_data.push [date.strftime("%d.%m.%Y"), { content: subtable, colspan: 3 }]
      end

      table(table_data, header: true, column_widths: widths) do
        cells.borders = [:bottom]
        cells.border_width = 0.5
        cells.valign = :center

        # pad the cells on top, right and bottom
        cells.padding = [5, 1, 5, 0]
        columns(0).padding = [0, 0, 5, 0]
        columns(2).align = :right

        row(0).columns(0..table_data[0].length - 2).padding = [5, 10, 5, 0]
        row(0).columns(table_data[0].length - 1).padding = [5, 1, 5, 0]

        row(0).borders = [:bottom]
        row(0).border_width = 1
        # row(0).font_style = :bold
        row(0).valign = :center
        row(0).font_style = :bold
      end

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
