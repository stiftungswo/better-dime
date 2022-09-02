# frozen_string_literal: true

require "prawn"

module Pdfs
  class EmployeeEffortReportPdf < BasePdf
    def initialize(global_setting, employee, from, to)
      @global_setting = global_setting
      @employee = employee
      @from = from
      @to = to
      super()
    end

    def filename
      "Mitarbeiter_" + @employee.full_name + "_Aufwandsrapport"
    end

    def draw
      Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, nil).draw(
        @default_text_settings,
        false
      )
      draw_description
      draw_efforts
    end

    def trim_text_if_needed(text, max_length)
      text_length = text.length
      trimming = text_length > max_length + 3
      ending_index = trimming ? max_length : max_length + 3
      text[0...ending_index] + (trimming ? "..." : "")
    end

    def draw_description
      move_down 40
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings

      total_effort_hours = @employee.project_efforts.select do |e|
        (@from..@to).include?(e.date) && e.project_position.rate_unit.is_time
      end.inject(0) { |sum, e| sum + e.value }

      move_down 5
      text "Aufwandsrapport - " + @employee.full_name, @default_text_settings.merge(size: 14, style: :bold)
      text "Aufwände vom " + @from.strftime("%d.%m.%Y") + " bis " + @to.strftime("%d.%m.%Y"), @default_text_settings
      text "Gesamtstunden: " + (total_effort_hours / 60.0).round(2).to_s, @default_text_settings
    end

    def draw_efforts
      move_down 20

      efforts = @employee.project_efforts.select { |e| (@from..@to).include?(e.date) }
      effort_dates = efforts.map(&:date).uniq

      table_data = [
        ["Datum", "Projekt", "Bezeichnung", "Anzahl", "Einheit"]
      ]

      content_widths = [bounds.width - 320, 150, 50, 45]
      widths = [75] + content_widths

      effort_dates.each do |date|
        date_data = []

        efforts.select { |e| e.date == date }.uniq(&:position_id).each do |effort|
          same_positions = efforts.select { |e| e.date == date && e.position_id == effort.position_id }
          date_data.push [
            trim_text_if_needed(effort.project_position.project.id.to_s + " - " + effort.project_position.project.name, 25),
            trim_text_if_needed(effort.project_position.service.name, 30),
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
          columns(2).align = :right
        end

        table_data.push [date.strftime("%d.%m.%Y"), { content: subtable, colspan: 4 }]
      end

      table(table_data, header: true, column_widths: widths) do
        cells.borders = [:bottom]
        cells.border_width = 0.5
        cells.valign = :center

        # pad the cells on top, right and bottom
        cells.padding = [5, 1, 5, 0]
        columns(0).padding = [0, 0, 5, 0]
        columns(3).align = :right

        row(0).columns(0..table_data[0].length - 2).padding = [5, 10, 5, 0]
        row(0).columns(table_data[0].length - 1).padding = [5, 1, 5, 0]

        row(0).borders = [:bottom]
        row(0).border_width = 1
        # row(0).font_style = :bold
        row(0).valign = :center
        row(0).font_style = :bold
      end
    end
  end
end
