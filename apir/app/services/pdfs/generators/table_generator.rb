# frozen_string_literal: true

module Pdfs
  module Generators
    class TableGenerator
      def initialize(document)
        @document = document
      end

      def render(data, column_widths, column_alignments = {}, padSides = false, isTotal = false)
        table_data = data.map do |row|
          row[:data]
        end

        table_style = data.map do |row|
          row[:style]
        end

        @document.table(table_data, header: true, column_widths: column_widths) do

          # Apply passed styles
          cells.borders = []

          table_style.each_with_index do |styles, index|
            next if styles.nil?

            styles.each do |style_key, style_value|
              row(index).send(style_key.to_s + "=", style_value) if style_key
            end
          end

          column_alignments.each do |key, value|
            columns(key).align = value
          end
          
          if isTotal
            rows(table_data.length-1).columns(0).text_color = '007DC2'
            rows(table_data.length-1).columns(1).text_color = 'ffffff'
            rows(table_data.length-1).columns(1).background_color = '007DC2'
          end

          if padSides
            columns(0).padding_left = 5
            columns(table_data[0].length - 1).padding_right = 5
          end
        end
      end
    end
  end
end