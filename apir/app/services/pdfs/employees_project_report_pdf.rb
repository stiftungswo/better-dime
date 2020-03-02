# frozen_string_literal: true

require "prawn"

module Pdfs
  class EmployeesProjectReportPdf < BasePdf
    include ActionView::Helpers::NumberHelper

    def initialize(global_setting, employees, from_date, to_date)
      @global_setting = global_setting
      @employees = employees
      @from_date = from_date
      @to_date = to_date
      super()
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
      ).select { |e| (@from_date..@to_date) === e.date }
    end

    def draw_description
      move_down 40
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings

      move_down 5
      text "Mitarbeiterraport".upcase, @default_text_settings.merge(size: 13, style: :bold)
      text "Leistungen vom " + @from_date.strftime("%d.%m.%Y") + " bis " + @to_date.strftime("%d.%m.%Y"), @default_text_settings
    end

    def draw_employee_efforts
      @employees.each do |employee|
        efforts = efforts_in_range(employee)
        effort_dates = efforts.map(&:date).uniq.sort

        if efforts.length > 0
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

              project_name = effort.project_position.project.name
              project_name_length = project_name.length

              table_data.push(
                data: [
                  date.strftime("%d.%m.%Y"),
                  (same_positions.inject(0) { |sum, e| sum + e.value } / effort.project_position.rate_unit.factor).round(1),
                  effort.project_position.service.name,
                  effort.project_position.project.id.to_s + " - " + project_name[0...27] + (project_name_length > 27 ? "..." : "")
                ],
                style: {
                  borders: [],
                  padding: [4, 10, 4, 0],
                }
              )
            end
          end


          move_down 25
          text employee.full_name.upcase, @default_text_settings.merge(size: 11, style: :bold)
          move_up 5
          indent(10, 0) do
            Pdfs::Generators::TableGenerator.new(@document).render(
              table_data,
              [bounds.width - 400, 400 - 200 - 150, 165, 185],
            )
          end
        else
          move_down 25
          text employee.full_name.upcase, @default_text_settings.merge(size: 11, style: :bold)
          line_width 0.65
          dash(1, space: 2)
          stroke_horizontal_rule
          undash
          move_up 15
        end
      end
    end
  end
end
