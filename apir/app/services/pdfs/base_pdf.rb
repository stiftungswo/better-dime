# frozen_string_literal: true

require "prawn"

module Pdfs
  class BasePdf
    include Prawn::View
    include Pdfs::PrawnHelper

    def initialize
      @spacing = 0.25
      @leading = 3
      @page_width = 520
      @page_height = 650
      @swo_blue = "007DC2"
      @default_text_settings = {
        character_spacing: @spacing,
        leading: @leading
      }

      update_font_families
      font "OpenSans", style: :normal, size: 9

      # stroke_axis

      bounding_box(
        [(bounds.width - @page_width) / 2.0, (bounds.height + @page_height) / 2.0],
        width: @page_width,
        height: @page_height
      ) do
        # stroke_axis

        draw
        draw_page_numbers
      end
    end

    def draw
      # your drawing logic here
    end

    def filename
      "no_name"
    end

    def draw_page_numbers
      number_pages "#{I18n.t(:page)} <page> von <total>",
                   start_count_at: 1,
                   at: [bounds.right - 80, bounds.bottom - 37],
                   align: :right,
                   size: 10,
                   color: "909090"
    end

    def document
      @document ||= Prawn::Document.new(page_size: "A4", page_layout: :portrait)
    end
  end
end
