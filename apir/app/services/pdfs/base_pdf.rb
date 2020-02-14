require 'prawn'

module Pdfs
  class BasePdf
    include Prawn::View
    include Pdfs::PrawnHelper

    def initialize
      @spacing = 0.25
      @leading = 3
      @page_width = 480
      @page_height = 700
      @default_text_settings = {
        :character_spacing => @spacing,
        :leading => @leading
      }

      update_font_families
      font "Helvetica", style: :normal, size: 10

      # stroke_axis

      bounding_box(
        [(bounds.width-@page_width)/2.0, bounds.height-(bounds.height-@page_height)/2.0],
        :width => @page_width,
        :height => @page_height
      ) do
        # stroke_axis

        draw
      end
    end

    def draw
      # your drawing logic here
    end

    def document
      @document ||= Prawn::Document.new(page_size: 'A4', page_layout: :portrait)
    end
  end
end
