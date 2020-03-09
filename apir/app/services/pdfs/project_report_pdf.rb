# frozen_string_literal: true

require "prawn"

module Pdfs
  class ProjectReportPdf < BasePdf
    include ActionView::Helpers::NumberHelper

    def initialize(global_setting, project, from_date, to_date, daily_rate, vat, additional_cost_names, additional_cost_prices)
      @global_setting = global_setting
      @project = project
      @from_date = from_date
      @to_date = to_date
      @daily_rate = daily_rate
      @vat = vat
      @additional_cost_names = additional_cost_names
      @additional_cost_prices = additional_cost_prices
      super()
    end

    def subtitle
      "Projekt Nr. " + @project.id.to_s
    end

    def format_money(amount)
      number_to_currency(amount, unit: "", separator: ".", delimiter: ",").tr(",", "'")
    end

    def efforts_in_range
      @efforts ||= @project.project_efforts.includes(
        :employee,
        project_position: [
          :rate_unit,
          :service
        ]
      ).select { |e| (@from_date..@to_date) === e.date }
    end

    def draw
      Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, @project).draw(
        @default_text_settings,
        false
      )

      draw_description
      draw_efforts
      draw_employee_summary
      draw_cost
      draw_additional_cost if @additional_cost_names.length > 0
      draw_total
    end

    def draw_description
      move_down 40
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings

      move_down 5
      text "Projektrapport: ".upcase + @project.name.upcase, @default_text_settings.merge(size: 13, style: :bold)
      text subtitle, @default_text_settings.merge(style: :bold)
      text "Leistungen vom " + @from_date.strftime("%d.%m.%Y") + " bis " + @to_date.strftime("%d.%m.%Y"), @default_text_settings
    end

    def draw_efforts
      move_down 20

      effort_dates = efforts_in_range.map(&:date).uniq.sort

      table_data = [
        {
          data: ["Datum", "Stunden", "Arbeit", "Mitarbeiter"],
          style: {
            padding: [5, 10, 5, 0],
            font_style: :bold,
            border_width: 1
          }
        }
      ]

      effort_dates.each do |date|
        efforts_in_range.select { |e| e.date == date }.each do |effort|
          same_positions = efforts_in_range.select do |e|
            e.date == date && e.position_id == effort.position_id && e.employee == effort.employee
          end

          table_data.push(
            data: [
              date.strftime("%d.%m.%Y"),
              (same_positions.inject(0) { |sum, e| sum + e.value } / effort.project_position.rate_unit.factor).round(1),
              effort.project_position.service.name,
              effort.employee.full_name
            ],
            style: {
              borders: [],
              padding: [4, 10, 4, 0]
            }
          )
        end
      end

      Pdfs::Generators::TableGenerator.new(@document).render(
        table_data,
        [bounds.width - 400, 400 - 175 - 125, 175, 125],
        [1] => :right
      )
    end

    def draw_employee_summary
      move_down 20

      table_data = [
        {
          data: ["Mitarbeiter", "Total Stunden"],
          style: {
            padding: [5, 0, 5, 0],
            font_style: :bold,
            border_width: 1
          }
        }
      ]

      effort_employees = efforts_in_range.map(&:employee).uniq.sort
      effort_employees.each do |employee|
        employee_efforts = efforts_in_range.select { |e| e.employee == employee }

        table_data.push(
          data: [
            employee.full_name,
            (employee_efforts.inject(0) { |sum, e| sum + e.value / e.project_position.rate_unit.factor }).round(1)
          ],
          style: {
            borders: [],
            padding: [4, 0, 4, 0]
          }
        )
      end

      Pdfs::Generators::TableGenerator.new(@document).render(
        table_data,
        [bounds.width - 200, 200],
        [1] => :right
      )
    end

    def draw_cost
      table_data = [
        {
          data: ["Tag", "Anzahl Mitarbeiter", "Berechnung", "Total CHF"],
          style: {
            padding: [5, 0, 5, 0],
            font_style: :bold,
            border_width: 1
          }
        }
      ]

      days_with_efforts = efforts_in_range.select { |e| e.value > 0 }.map(&:date).uniq
      # map every day to the amount of employees which worked on that day
      days_to_employees = days_with_efforts.map do |day|
        [day, efforts_in_range.select { |e| e.date == day && e.value > 0}.map(&:employee).uniq.length]
      end.to_h.sort_by { |item| item[0] }

      total = days_to_employees.inject(0) do |sum, (day, employees)|
        sum + employees * @daily_rate
      end

      padding = [4,2,4,2]

      days_to_employees.each do |day, employees|
        table_data.push(
          data: [
            day.strftime("%d.%m.%Y"),
            employees.to_s,
            employees.to_s + " * " + format_money(@daily_rate),
            format_money(format_money(employees * @daily_rate))
          ],
          style: {
            borders: [],
            padding: padding
          }
        )
      end

      table_data.push(
        data: [
          "Subtotal",
          "",
          "",
          format_money(total)
        ],
        style: {
          borders: [:top],
          border_width: 0.5,
          padding: padding
        }
      )

      @document.move_down 15
      @document.text "Mitarbeiter Kosten".upcase, size: 10, style: :bold

      @document.indent(20, 0) do
        Pdfs::Generators::TableGenerator.new(@document).render(
          table_data,
          [bounds.width-325,150,100,75],
          [3] => :right,
          [1] => :center
        )
      end
    end

    def draw_additional_cost
      padding = [4,2,4,2]

      table_data = [
        {
          data: ["Beschreibung", "Total CHF"],
          style: {
            padding: [5, 0, 5, 0],
            font_style: :bold,
            border_width: 1
          }
        }
      ]
      additional_costs = @additional_cost_names.zip(@additional_cost_prices)
      total = @additional_cost_prices.inject(0) {|sum, p| sum + (p.to_f)/100.0}

      additional_costs.each do |cost|
        table_data.push(
          data: [
            cost[0],
            format_money((cost[1].to_f)/100.0)
          ],
          style: {
            borders: [],
            padding: padding
          }
        )
      end

      table_data.push(
        data: [
          "Subtotal",
          format_money(total)
        ],
        style: {
          borders: [:top],
          border_width: 0.5,
          padding: padding
        }
      )

      @document.move_down 15
      @document.text "Zusätzliche Kosten".upcase, size: 10, style: :bold

      @document.indent(20, 0) do
        Pdfs::Generators::TableGenerator.new(@document).render(
          table_data,
          [bounds.width/4*3,bounds.width/4],
          [1] => :right
        )
      end
    end

    def draw_total
      padding = [4,2,4,2]
      days_with_efforts = efforts_in_range.select { |e| e.value > 0 }.map(&:date).uniq
      # map every day to the amount of employees which worked on that day
      days_to_employees = days_with_efforts.map do |day|
        [day, efforts_in_range.select { |e| e.date == day && e.value > 0}.map(&:employee).uniq.length]
      end.to_h.sort_by { |item| item[0] }
      employee_total = days_to_employees.inject(0) do |sum, (day, employees)|
        sum + employees * @daily_rate
      end

      total = @additional_cost_prices.inject(0) {|sum, p| sum + (p.to_f)/100.0} + employee_total
      table_data = [{
        data: ["", "Berechnung", "Total CHF"],
        style: {
          padding: [5, 0, 5, 0],
          font_style: :bold,
          border_width: 1
        }
      }]

      table_data.push(
        data: [
          "MwSt.",
          (@vat * 100).to_s + "% * " + format_money(total),
          format_money(@vat * total)
        ],
        style: {
          borders: [],
          border_width: 0.5,
          padding: padding
        }
      )

      table_data.push(
        data: [
          "Total",
          "",
          format_money((1+@vat) * total)
        ],
        style: {
          borders: [:top],
          border_width: 0.5,
          padding: padding,
          font_style: :bold,
        }
      )

      Pdfs::Generators::TableGenerator.new(@document).render(
        table_data,
        [bounds.width-175, 100, 75],
        [2] => :right
      )
    end
  end
end
