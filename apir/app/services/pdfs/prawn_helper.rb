# frozen_string_literal: true

module Pdfs
  module PrawnHelper
    # Embeds the filename as the PDF title. Browsers opening the PDF from a blob: URL (no
    # Content-Disposition available) use it as the suggested name when saving.
    def pdf_info
      respond_to?(:filename) ? { Title: filename } : {}
    end

    def cursor_save
      cursor.tap do |old_cursor|
        yield
        move_cursor_to old_cursor
      end
    end

    def update_font_families
      font_families.update(
        "OpenSans" => {
          normal: font_file_path("OpenSans-Regular.ttf"),
          bold: font_file_path("OpenSans-Bold.ttf"),
          italic: font_file_path("OpenSans-Italic.ttf")
        }
      )
      font_families.update(
        "PTSerif" => {
          normal: font_file_path("PTSerif-Regular.ttf"),
          bold: font_file_path("PTSerif-Bold.ttf"),
          italic: font_file_path("PTSerif-Italic.ttf")
        }
      )
      font "OpenSans"
    end

    private

    def font_file_path(filename)
      Rails.root.join("app", "assets", "fonts", filename)
    end
  end
end
