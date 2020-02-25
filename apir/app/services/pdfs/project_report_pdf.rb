require 'prawn'

module Pdfs
  class ProjectReportPdf < BasePdf
    include ActionView::Helpers::NumberHelper

    def initialize(global_setting, project, from_date, to_date, daily_rate, vat)
      @global_setting = global_setting
      @project = project
      @from_date = from_date
      @to_date = to_date
      @daily_rate = daily_rate
      @vat = vat
      super()
    end

    def subtitle
      "Projekt Nr. " + @project.id.to_s
    end

    def format_money(amount)
      number_to_currency(amount, unit: "", separator: ".", delimiter: ",").gsub(',',"'")
    end

    def efforts_in_range
      @project.project_efforts.select { |e| (@from_date..@to_date) === e.date}
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
    end

    def draw_description
      move_down 40
      text @global_setting.sender_city + ", " + Time.current.to_date.strftime("%d.%m.%Y"), @default_text_settings

      move_down 5
      text "Projektrapport: ".upcase + @project.name.upcase, @default_text_settings.merge(:size => 13, :style => :bold)
      text subtitle, @default_text_settings.merge(style: :bold)
      text "Leistungen vom " + @from_date.strftime("%d.%m.%Y") + " bis " + @to_date.strftime("%d.%m.%Y"), @default_text_settings
    end

    def draw_efforts
      move_down 20

      effort_dates = efforts_in_range.map {|e| e.date}.uniq.sort

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
        efforts_in_range.select {|e| e.date == date}.uniq {|e| e.position_id}.each do |effort|
          same_positions = efforts_in_range.select {|e| e.date == date && e.position_id == effort.position_id && e.employee == effort.employee}

          table_data.push({
            data: [
              date.strftime("%d.%m.%Y"),
              (same_positions.inject(0) {|sum,e| sum + e.value} / effort.project_position.rate_unit.factor).round(1),
              effort.project_position.service.name,
              effort.employee.full_name
            ],
            style: {
              borders: [],
              padding: [4, 10, 4, 0]
            }
          })
        end
      end

      Pdfs::Generators::TableGenerator.new(@document).render(
        table_data,
        [bounds.width-400, 400-175-125, 175, 125],
        {
          [1] => :right,
        },
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

      effort_employees = efforts_in_range.map {|e| e.employee}.uniq.sort
      effort_employees.each do |employee|
        employee_efforts = efforts_in_range.select {|e| e.employee == employee}

        table_data.push({
          data: [
            employee.full_name,
            (employee_efforts.inject(0) {|sum,e| sum + e.value/e.project_position.rate_unit.factor}).round(1)
          ],
          style: {
            borders: [],
            padding: [4, 0, 4, 0]
          }
        })
      end

      Pdfs::Generators::TableGenerator.new(@document).render(
        table_data,
        [bounds.width-200, 200],
        {
          [1] => :right,
        },
      )
    end

    def draw_cost
      move_down 20

      table_data = [
        {
          data: ["Kostenstelle", "Berechnung", "Total CHF"],
          style: {
            padding: [5, 0, 5, 0],
            font_style: :bold,
            border_width: 1
          }
        }
      ]

      effort_employees = efforts_in_range.map {|e| e.employee}.uniq.sort
      days_with_efforts = efforts_in_range.select {|e| e.value > 0}.map {|e| e.date}.uniq

      table_data.push({
        data: [
          "Total Einsatztage",
          days_with_efforts.length.to_s + " * " + format_money(@daily_rate),
          format_money(days_with_efforts.length*@daily_rate)
        ],
        style: {
          borders: [],
          padding: [4, 0, 4, 0]
        }
      })

      table_data.push({
        data: [
          "MwSt.",
          (@vat*100).to_s + "% * " + format_money(days_with_efforts.length*@daily_rate),
          format_money(@vat * days_with_efforts.length*@daily_rate)
        ],
        style: {
          borders: [],
          padding: [4, 0, 4, 0]
        }
      })

      table_data.push({
        data: [
          "Total",
          "",
          format_money((1+@vat) * days_with_efforts.length*@daily_rate)
        ],
        style: {
          font_style: :bold,
          borders: [],
          padding: [4, 0, 4, 0]
        }
      })

      Pdfs::Generators::TableGenerator.new(@document).render(
        table_data,
        [bounds.width-275,200,75],
        {
          [2] => :right,
        },
      )
    end
  end
end
