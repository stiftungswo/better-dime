# frozen_string_literal: true

module Pdfs
  module Generators
    class BreakdownTableGenerator
      def initialize(document, breakdown)
        @document = document
        @breakdown = breakdown
      end

      def render(header)
        if @breakdown[:grouped_positions].length > 1
          @breakdown[:grouped_positions].each do |group|
            @document.move_down 15
            @document.text group[:group_name].upcase, size: 10, style: :bold, character_spacing: @spacing, leading: @leading
            @document.move_up 15

            @document.indent(20, 0) do
              render_positions_table header, group[:positions], group[:subtotal], false
            end
          end

          @document.move_down 5
          Pdfs::Generators::TableGenerator.new(@document).render(
            [{
              data: ["Subtotal", (@breakdown[:subtotal] / 100.0).round(2)],
              style: {
                borders: [:top],
                padding: [-2, 1, 0, 0],
                font_style: :bold
              }
            }],
            [@document.bounds.width - 100, 100],
            [1] => :right
          )
        else
          render_positions_table header, @breakdown[:grouped_positions][0][:positions], @breakdown[:subtotal], true
        end

        @document.move_down 20
        render_discounts
        render_total
      end

      def render_positions_table(header, positions, subtotal, bold_highlight)
        font_style = bold_highlight ? :bold : :normal

        data = [{
          data: header,
          style: {
            font_style: font_style
          }
        }]

        positions.each do |position|
          data.push(data: [
                      position.try(:service).try(:name) || position.description,
                      (position.price_per_rate / 100.0).round(2),
                      position.rate_unit.billing_unit,
                      position.amount,
                      (position.vat * 100.0).round(2).to_s + "%",
                      (position.calculated_total_excl_vat / 100.0).round(2)
                    ])
        end

        data.push(
          data: ["Subtotal", "", "", "", "", (subtotal / 100.0).round(2)],
          style: {
            font_style: font_style
          }
        )

        Pdfs::Generators::TableGenerator.new(@document).render(
          data,
          [155, 80, 60, 55, 45, @document.bounds.width - 395],
          [1, 4, 5] => :right
        )
      end

      def render_discounts
        if @breakdown[:discounts].length > 0
          data = [
            {
              data: ["Abzug", "Betrag"],
              style: {
                font_style: :bold,
                padding: [2, 1, 7, 0],
                align: :right
              }
            }
          ]

          padding = [4, 1, 4, 0]

          @breakdown[:discounts].each do |discount|
            data.push(
              data: [discount[:name], discount[:value] / 100.0],
              style: {
                font_style: :normal,
                padding: padding
              }
            )
          end
          data.push(
            data: ["Abzüge Total", (@breakdown[:discount_total] / 100.0).round(2)],
            style: {
              font_style: :normal,
              borders: [:top],
              border_width: 0.5,
              padding: padding
            }
          )
          data.push(
            data: ["Subtotal", (@breakdown[:raw_total] / 100.0).round(2)],
            style: {
              font_style: :bold,
              padding: padding
            }
          )

          Pdfs::Generators::TableGenerator.new(@document).render(
            data,
            [@document.bounds.width - 70, 70],
            {
              [0, 1] => :right
            },
            false
          )

          @document.move_down 20
        end
      end

      def render_total
        data = [
          {
            data: ["MwSt.", "Betrag"],
            style: {
              font_style: :bold,
              padding: [2, 1, 7, 0],
              align: :right
            }
          }
        ]

        padding = [4, 1, 4, 0]

        @breakdown[:vats].each do |vat|
          data.push(
            data: [(vat[:vat].to_f * 100.0).to_s + "%", (vat[:value] / 100.0).round(2)],
            style: {
              font_style: :normal,
              padding: padding
            }
          )
        end
        data.push(
          data: ["Mehrwertsteuer Total", (@breakdown[:vat_total] / 100.0).round(2)],
          style: {
            font_style: :normal,
            borders: [:top],
            border_width: 0.5,
            padding: padding
          }
        )
        data.push(
          data: ["Total", (@breakdown[:total] / 100.0).round(2)],
          style: {
            font_style: :bold,
            padding: padding
          }
        )

        Pdfs::Generators::TableGenerator.new(@document).render(
          data,
          [@document.bounds.width - 70, 70],
          {
            [0, 1] => :right
          },
          false
        )
      end
    end
  end
end
