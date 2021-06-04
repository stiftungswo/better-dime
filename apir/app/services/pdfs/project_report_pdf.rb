# frozen_string_literal: true

require "prawn"

module Pdfs
  class ProjectReportPdf < BasePdf
    include ActionView::Helpers::NumberHelper

    def initialize(global_setting, project, from_date, to_date, daily_rate, vat, exclude_employee_ids, additional_cost_names, additional_cost_prices)
      @global_setting = global_setting
      @project = project
      @from_date = from_date
      @to_date = to_date
      @daily_rate = daily_rate
      @vat = vat
      @exclude_employee_ids = exclude_employee_ids
      @additional_cost_names = additional_cost_names
      @additional_cost_prices = additional_cost_prices
      @total = 0
      super()
    end

    def filename
      "ProjektRaport_" + @project.id.to_s
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
      ).select do |e|
        (@from_date..@to_date) === e.date &&
          !e.employee.id.to_i.in?(@exclude_employee_ids.map(&:to_i))
      end
    end

    def draw
      Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, @project).draw(
        @default_text_settings,
        false
      )

      draw_description
      draw_efforts
      draw_cost
      draw_additional_cost unless @additional_cost_names.empty?
      draw_total
    end

    def draw_description
      move_down 40
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings

      move_down 5
      text "Projektrapport: " + @project.name, @default_text_settings.merge(size: 14, style: :bold)
      text subtitle, @default_text_settings.merge(style: :bold)
      text "Aufwände vom " + @from_date.strftime("%d.%m.%Y") + " bis " + @to_date.strftime("%d.%m.%Y"), @default_text_settings
    end

    def draw_efforts
      move_down 20

      effort_dates = efforts_in_range.map(&:date).uniq.sort

      table_data = [
        {
          data: ["Datum", "Anzahl", "Einheit", "Arbeit", "Mitarbeiter"],
          style: {
            padding: [7, 10, 5, 0],
            font_style: :bold,
            border_width: 1,
            borders: [:top]
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
              #(effort.project_position.price_per_rate / 100).to_s + " " + effort.project_position.rate_unit.billing_unit.to_s,
              effort.project_position.rate_unit.name,
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
        [bounds.width - 400, 50, 50, 175, 125],
        [1] => :right
      )
    end

    def draw_cost
      table_data = [
        {
          data: ["Mitarbeiter", "Service", "Berechnung", "Total CHF"],
          style: {
            padding: [5, 0, 5, 0],
            font_style: :bold,
            border_width: 1,
            borders: [:bottom]
          }
        }
      ]
      
      padding = [4, 2, 4, 2]

      effort_employees = efforts_in_range.map(&:employee).uniq.sort

      effort_employees.each do |employee|
        used_position_ids = []
        efforts_in_range.select { |e| e.employee == employee }.each do |effort|
          same_positions = efforts_in_range.select do |e|
            e.employee == employee && e.position_id == effort.position_id
          end

          unless used_position_ids.include? effort.position_id
            used_position_ids.push(effort.position_id)
            total_amount = (same_positions.inject(0) { |sum, e| sum + e.value } / effort.project_position.rate_unit.factor).round(1)
            # Blindoles Blindoles costs nothing, it's meant for machines etc.
            @total = @total + (total_amount * effort.project_position.price_per_rate / 100)

            rate_unit = effort.project_position.rate_unit
            amount_string = total_amount.to_s + rate_unit.effort_unit.to_s
            unit_string = (effort.project_position.price_per_rate / 100).to_s + " " + rate_unit.billing_unit.to_s

            table_data.push(
              data: [
                employee.full_name,
                effort.project_position.service.name,
                amount_string + " * " + unit_string,
                format_money(total_amount * effort.project_position.price_per_rate / 100)
              ],
              style: {
                borders: [],
                padding: padding
              }
            )
          end
        end
      end

      table_data.push(
        data: [
          "Subtotal",
          "",
          "",
          format_money(@total)
        ],
        style: {
          borders: [:top],
          border_width: 0.5,
          padding: padding
        }
      )

      @document.move_down 15
      @document.text "Mitarbeiter Kosten", size: 10, style: :bold

      @document.indent(20, 0) do
        Pdfs::Generators::TableGenerator.new(@document).render(
          table_data,
          [bounds.width - 325, 150, 100, 75],
          [3] => :right,
          [1] => :center
        )
      end
    end

    def draw_additional_cost
      padding = [4, 2, 4, 2]

      table_data = [
        {
          data: ["Beschreibung", "Total CHF"],
          style: {
            padding: [5, 0, 5, 0],
            font_style: :bold,
            border_width: 1,
            borders: [:top]
          }
        }
      ]
      additional_costs = @additional_cost_names.zip(@additional_cost_prices)
      additional_total = @additional_cost_prices.inject(0) { |sum, p| sum + p.to_f / 100.0 }

      additional_costs.each do |cost|
        table_data.push(
          data: [
            cost[0],
            format_money(cost[1].to_f / 100.0)
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
          format_money(additional_total)
        ],
        style: {
          borders: [:top],
          border_width: 0.5,
          padding: padding
        }
      )

      @document.move_down 15
      @document.text "Zusätzliche Kosten", size: 10, style: :bold

      @document.indent(20, 0) do
        Pdfs::Generators::TableGenerator.new(@document).render(
          table_data,
          [bounds.width / 4 * 3, bounds.width / 4],
          [1] => :right
        )
      end
    end

    def draw_total
      padding = [4, 2, 4, 2]
    
      final_total = @additional_cost_prices.inject(0) { |sum, p| sum + p.to_f / 100.0 } + @total
      table_data = [{
        data: ["", "Berechnung", "Total CHF"],
        style: {
          padding: [5, 0, 5, 0],
          font_style: :bold,
          border_width: 1,
          borders: [:bottom]
        }
      }]

      table_data.push(
        data: [
          "MwSt.",
          (@vat * 100).to_s + "% * " + format_money(final_total),
          format_money(@vat * final_total)
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
          format_money((1 + @vat) * final_total)
        ],
        style: {
          borders: [:top],
          border_width: 0.5,
          padding: padding,
          font_style: :bold
        }
      )

      Pdfs::Generators::TableGenerator.new(@document).render(
        table_data,
        [bounds.width - 175, 100, 75],
        [2] => :right
      )
    end
  end
end
