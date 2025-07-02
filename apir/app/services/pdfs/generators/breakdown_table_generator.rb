# frozen_string_literal: true

module Pdfs
  module Generators
    class BreakdownTableGenerator
      include ActionView::Helpers::NumberHelper

      def initialize(document, breakdown, report = false)
        @document = document
        @breakdown = breakdown
        @swo_blue = "007DC2"
        @border_color = "81827e"
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
        @document.fill_color "ffffff"
        @document.move_down 6
        @document.indent(4, 0) do
          @document.text title, style: :bold
        end
        @document.fill_color "000000"
        @document.move_down 6
      end

      def render(header)
        if @breakdown[:grouped_positions].length.positive?
          if @breakdown[:grouped_positions].length > 1
            @breakdown[:grouped_positions].each do |group|
              @document.move_down 30
              @document.start_new_page if @document.cursor < 100
              table_title(group[:group_name])
              render_positions_table header, group[:positions], group[:subtotal]
            end
          else
            @breakdown[:grouped_positions].length === 1
            @document.move_down 30
            @document.start_new_page if @document.cursor < 100
            table_title(@breakdown[:grouped_positions][0][:group_name])
            render_positions_table header, @breakdown[:grouped_positions][0][:positions], @breakdown[:subtotal]
          end
          @document.move_down 20
        end
        @document.start_new_page if @document.cursor < 140
        render_subtotal
        render_total
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
              position.description.presence || position.try(:service).try(:name),
              format_money(position.price_per_rate),
              position.rate_unit.billing_unit,
              position.amount,
              "#{(position.vat * 100.0).round(2)}%",
              format_money(position.calculated_total)
            ],
            style: {
              padding: [6, 0, 6, 0],
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
        padding = [6, 10, 6, 0]
        fixed_price = @breakdown[:fixed_price]
        discounts = @breakdown[:discounts]
        data = []

        unless fixed_price&.positive?

          unless discounts.empty?

            data.push(
              data: [(I18n.t :discount).capitalize, (I18n.t :amount).capitalize],
              style: {
                font_style: :bold,
                padding: padding
              }
            )

            discounts.each do |discount|
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
          end

          data.push(
            data: [(I18n.t :subtotal_excl_vat), format_money(@breakdown[:raw_total], :ceil)],
            style: {
              font_style: :bold,
              padding: padding
            }
          )
        end

        if fixed_price&.positive?
          data.push(
            data: [I18n.t(:fix_price_excl_vat), format_money(fixed_price / (@breakdown[:fixed_price_vat] + 1))],
            style: {
              font_style: :bold,
              padding: padding
            }
          )
        end

        Pdfs::Generators::TableGenerator.new(@document).render(
          data,
          [@document.bounds.width - 70, 70],
          {
            [0, 1] => :right
          },
          true
        )
        @document.move_down 10
      end

      def render_vat_subtotals
        padding = [6, 10, 6, 0]
        vats = @breakdown[:vats_by_costgroup] || []
        data = []

        # Title/header row for VAT breakdown
        data.push(
          data: [
            (I18n.t :vat_rate).capitalize,
            (I18n.t :cost_group_short).capitalize,
            (I18n.t :subtotal).capitalize,
            (I18n.t :vat).capitalize
          ],
          style: {
            font_style: :bold,
            padding: padding
          }
        )

        # Dynamically generate rows for each VAT category
        vats.each do |vat_group|
          vat, positions = vat_group

          vat_rate = "#{(vat.to_f * 100).round(2)}%" # e.g., "7.5%"

          first_position, *other_positions = positions.to_a

          data.push(
            data: [vat_rate, first_position[:cg], format_money(first_position[:subtotal]), format_money(first_position[:value])],
            style: { padding: padding }
          )

          other_positions.each do |position|
            data.push(
              data: ["", position[:cg], format_money(position[:subtotal]), format_money(position[:value])],
              style: { padding: padding }
            )
          end
          #
          # subtotal = format_money(vat[1][:subtotal])          # Assuming subtotal exists per VAT category
          # vat_amount = format_money(vat[1][:factor])          # The actual VAT value for this category

          # data.push(
          #   data: [vat_rate, '', subtotal, vat_amount],
          #   style: { padding: padding }
          # )
        end

        # Render the VAT subtotals table
        Pdfs::Generators::TableGenerator.new(@document).render(
          data,
          [@document.bounds.width - 210, 70, 70, 70], # Layout for VAT rate, subtotal, VAT amount
          { [0, 1, 2, 3] => :right },
          true
        )
        @document.move_down 10
      end

      def render_total
        padding = [6, 10, 6, 0]
        fixed_price = @breakdown[:fixed_price]
        has_fixed_price = fixed_price&.positive?

        data = [
          {
            data: [(I18n.t :vat), (I18n.t :amount).capitalize],
            style: {
              font_style: :bold,
              padding: padding
            }
          }
        ]

        render_vat_subtotals unless has_fixed_price

        total = has_fixed_price ? @breakdown[:fixed_price] : @breakdown[:total]
        vat_total = has_fixed_price ? (total - (fixed_price / (@breakdown[:fixed_price_vat] + 1))) : @breakdown[:vat_total]

        if has_fixed_price
          data.push(
            data: ["#{@breakdown[:fixed_price_vat] * 100}%", format_money(vat_total)],
            style: {
              padding: padding
            }
          )
        end

        data.push(
          data: [(I18n.t :total_vat), format_money(vat_total)],
          style: {
            padding: padding
          }
        )

        data.push(
          data: [has_fixed_price ? I18n.t(:fix_price_total) : I18n.t(:total), format_money(total, :ceil)],
          style: {
            font_style: :bold,
            padding: padding,
            size: 11
          }
        )

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
