module Pdfs
  module Generators
    class TableGenerator
      def initialize(document)
        @document = document
      end

      def render(data, column_widths, column_alignments = {}, has_footer = true)
        table_data = data.map do |row|
          row[:data]
        end

        table_style = data.map do |row|
          row[:style]
        end

        @document.table(table_data, :header => true, :column_widths => column_widths) do
          cells.borders = []
          # pad the cells on top, right and bottom
          columns(0..table_data[0].length-2).padding = [5, 10, 5, 0]
          # only have a very small right padding on the right most cell
          columns(table_data[0].length-1).padding = [5, 1, 5, 0]

          row(0).columns(0..table_data[0].length-2).padding = [5, 10, 10, 0]
          row(0).columns(table_data[0].length-1).padding = [5, 1, 10, 0]

          row(0).borders = [:bottom]
          row(0).border_width = 0.5
          # row(0).font_style = :bold
          row(0).valign = :center

          column_alignments.each do |key, value|
            columns(key).align = value
          end

          if has_footer
            row(table_data.length - 1).borders = [:top]
            row(table_data.length - 1).border_width = 0.5
            # row(data.length - 1).font_style = :bold
          end

          table_style.each_with_index do |styles, index|
            unless styles.nil?
              styles.each do |style_key, style_value|
                row(index).send(style_key.to_s + "=", style_value) unless style_key.nil?
              end
            end
          end
        end
      end
    end
  end
end
