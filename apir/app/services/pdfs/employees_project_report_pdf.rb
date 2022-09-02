# frozen_string_literal: true

require "prawn"

module Pdfs
  class EmployeesProjectReportPdf < BasePdf
    include ActionView::Helpers::NumberHelper

    def initialize(global_setting, employees, from_date, to_date)
      @global_setting = global_setting
      @employees = employees.sort_by(&:full_name)
      @from_date = from_date
      @to_date = to_date
      super()
    end

    def filename
      if @employees.length == 1
        "Mitarbeiter_#{@employees[0].full_name}_Aufwandsrapport"
      else
        "Mitarbeiter_Projekt_Aufwandsrapport"
      end
    end

    def draw
      Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, nil).draw(
        @default_text_settings,
        false
      )

      draw_description
      draw_employee_efforts
    end

    def efforts_in_range(employee)
      employee.project_efforts.includes(
        :employee,
        project_position: [
          :rate_unit,
          :project,
          :service
        ]
      ).select { |e| (@from_date..@to_date).include?(e.date) && e.project_position.rate_unit.is_time && e }
    end

    def trim_text_if_needed(text, max_length)
      text_length = text.length
      trimming = text_length > max_length + 3
      ending_index = trimming ? max_length : max_length + 3
      text[0...ending_index] + (trimming ? "..." : "")
    end

    def draw_description
      move_down 40
      text "#{@global_setting.sender_city}, #{Time.current.to_date.strftime("%d.%m.%Y")}", @default_text_settings

      move_down 5
      text "Mitarbeiterraport", @default_text_settings.merge(size: 14, style: :bold)
      text "Aufwände von #{@employees.map(&:full_name).join(", ")}", @default_text_settings
      text "Aufwände vom #{@from_date.strftime("%d.%m.%Y")} bis #{@to_date.strftime("%d.%m.%Y")}", @default_text_settings
    end

    def get_total_hours(employee)
      efforts = efforts_in_range(employee)

      sum = 0

      efforts.each do |e|
        sum += e.value
      end

      (sum / 60.0).round(2)
    end

    def draw_employee_efforts
      @employees.each do |employee|
        efforts = efforts_in_range(employee).sort_by { |e| [e.date, e.project_position.project.id] }
        effort_dates = efforts.map(&:date).uniq.sort

        if efforts.empty?
          move_down 25
          text employee.full_name, @default_text_settings.merge(size: 11, style: :bold)
          line_width 0.65
          dash(1, space: 2)
          stroke_horizontal_rule
          undash
          move_up 15
        else
          table_data = [
            {
              data: ["Datum", "Stunden", "Arbeit", "Projekt"],
              style: {
                padding: [5, 10, 5, 0],
                borders: [],
                font_style: :bold,
                border_width: 0.65
              }
            }
          ]

          effort_dates.each do |date|
            efforts.select { |e| e.date == date }.each do |effort|
              same_positions = efforts.select do |e|
                e.date == date && e.position_id == effort.position_id && e.employee == effort.employee
              end

              table_data.push(
                data: [
                  date.strftime("%d.%m.%Y"),
                  (same_positions.inject(0) { |sum, e| sum + e.value } / 60).round(1),
                  trim_text_if_needed(effort.project_position.service.name, 25),
                  "#{effort.project_position.project.id} - #{trim_text_if_needed(effort.project_position.project.name, 27)}"
                ],
                style: {
                  borders: [],
                  padding: [4, 10, 4, 0]
                }
              )
            end
          end

          move_down 25
          text "<b>#{employee.full_name} | </b><font size='9'>Total Stunden: #{get_total_hours(employee)}</font>", @default_text_settings.merge(inline_format: true, size: 11)
          move_up 5
          indent(10, 0) do
            Pdfs::Generators::TableGenerator.new(@document).render(
              table_data,
              [bounds.width - 400, 400 - 200 - 150, 165, 185]
            )
          end
        end
      end
    end
  end
end
