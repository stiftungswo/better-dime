# frozen_string_literal: true

module Pdfs
  module Generators
    class BreakdownTableGenerator
      include ActionView::Helpers::NumberHelper

      def initialize(document, breakdown, report = false)
        @document = document
        @breakdown = breakdown
        @swo_blue = '007DC2'
        @border_color = '81827e'
        @report = report
      end

      def format_money(amount, rounding_method = :round)
        rounded = (amount / 5.0).round * 5 / 100.0 if rounding_method == :round
        rounded = (amount / 5.0).ceil * 5 / 100.0 if rounding_method == :ceil
        rounded = (amount / 5.0).floor * 5 / 100.0 if rounding_method == :floor
        number_to_currency(rounded, unit: "", separator: ".", delimiter: ",").tr(",", "'")
      end

      def table_title(title)
        @document.fill_color @swo_blue
        @document.transparent(1) do
          @document.fill_rectangle [0, @document.cursor], @document.bounds.width, 20
        end
        @document.fill_color 'ffffff'
        @document.move_down 6
        @document.indent(4,0) do
          @document.text title, style: :bold
        end
        @document.fill_color '000000'
        @document.move_down 6
      end

      def render(header)
        if @breakdown[:grouped_positions].length > 0
          if @breakdown[:grouped_positions].length > 1
            @breakdown[:grouped_positions].each do |group|
              @document.start_new_page if @document.cursor < 100
              table_title(group[:group_name])
              render_positions_table header, group[:positions], group[:subtotal]
              @document.move_down 30
            end

            # @document.move_down 5
            # Pdfs::Generators::TableGenerator.new(@document).render(
            #   [{
            #     data: [(I18n.t :subtotal).capitalize, format_money(@breakdown[:subtotal], :ceil)],
            #     style: {
            #       borders: [:top],
            #       padding: [-2, 1, 0, 0],
            #       font_style: :bold
            #     }
            #   }],
            #   [@document.bounds.width - 100, 100],
            #   [1] => :right
            # )
          else @breakdown[:grouped_positions].length === 1
            table_title(@breakdown[:grouped_positions][0][:group_name])
            render_positions_table header, @breakdown[:grouped_positions][0][:positions], @breakdown[:subtotal]
          end
          @document.move_down 20
          @document.start_new_page if @document.cursor < 110
          render_discounts
          @document.start_new_page if @document.cursor < 50
          render_total
        end
      end

      def render_positions_table(header, positions, subtotal)
        padding = [6, 0, 0, 0]

        data = [{
          data: header,
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

        positions.sort_by(&:order).each do |position|
          data.push(
            data: [
                    position.description.blank? ? position.try(:service).try(:name) : position.description,
                    format_money(position.price_per_rate),
                    position.rate_unit.billing_unit,
                    position.amount,
                    (position.vat * 100.0).round(2).to_s + "%",
                    format_money(position.calculated_total)
                  ],
            style: {
              height: 22,
              padding: padding,
              border_color: @border_color,
              borders: [:bottom],
              border_width: 0.5
            }
          )
        end

        data.push(
          data: [(I18n.t :subtotal).capitalize, "", "", "", "", format_money(subtotal, :ceil)],
          style: {
            height: 22,
            padding: padding,
            font_style: :bold,
            border_color: @border_color,
            borders: [:bottom],
            border_width: 0.5
          }
        )

        Pdfs::Generators::TableGenerator.new(@document).render(
          data,
          [185, 80, 60, 55, 55, @document.bounds.width - 435],
          {
            [5] => :right
          },
          true
        )
      end

      def render_subtotal
        data = [
          {
            data: [I18n.t(:subtotal_transfer), format_money(@breakdown[:total], :ceil)],
            style: {
              height: 30,
              valign: :bottom,
              padding: [0, 5, 7, 5],
              font_style: :bold,
              border_width: 0.5
            }
          }
        ]

        Pdfs::Generators::TableGenerator.new(@document).render(
          data,
          [@document.bounds.width - 70, 70],
            {
              [0, 1] => :right
            },
            true
        )
      end

      def render_discounts
        # unless @breakdown[:discounts].empty?

          padding = [6, 10, 6, 0]

          data = [
            {
              data: [(I18n.t :discount).capitalize, (I18n.t :amount).capitalize],
              style: {
                font_style: :bold,
                padding: padding
              }
            }
          ]

          @breakdown[:discounts].each do |discount|
            data.push(
              data: [discount[:name], format_money(discount[:value])],
              style: {
                padding: padding
              }
            )
          end
          data.push(
            data: [(I18n.t :total_discount).capitalize, format_money(@breakdown[:discount_total], :floor)],
            style: {
              padding: padding
            }
          )
          data.push(
            data: [(I18n.t :subtotal).capitalize, format_money(@breakdown[:raw_total], :ceil)],
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
            true
          )

          @document.move_down 20
        # end
      end

      def render_total

        padding = [6, 10, 6, 0]

        data = [
          {
            data: [(I18n.t :vat), (I18n.t :amount).capitalize],
            style: {
              font_style: :bold,
              padding: padding
            }
          }
        ]

        @breakdown[:vats].each do |vat|
          data.push(
            data: [(vat[:vat].to_f * 100.0).round(2).to_s + "%", format_money(vat[:value])],
            style: {
              padding: padding
            }
          )
        end
        data.push(
          data: [(I18n.t :total_vat), format_money(@breakdown[:vat_total], :ceil)],
          style: {
            padding: padding
          }
        )
        data.push(
          data: [I18n.t(:total), format_money(@breakdown[:total], :ceil)],
          style: {
            font_style: :bold,
            padding: padding,
            size: 11
          }
        )

        if @breakdown[:fixed_price] && @breakdown[:fixed_price] > 0
          data.push(
            data: [I18n.t(:fix_price_total), format_money(@breakdown[:fixed_price], :ceil)],
            style: {
              font_style: :bold,
              padding: padding,
              size: 11
            }
          )
        end

        Pdfs::Generators::TableGenerator.new(@document).render(
          data,
          [@document.bounds.width - 70, 70],
          {
            [0, 1] => :right
          },
          true,
          true
        )
      end
    end
  end
end
