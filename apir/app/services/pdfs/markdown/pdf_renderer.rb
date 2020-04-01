# frozen_string_literal: true

module Pdfs
  module Markdown
    class PdfRenderer < Redcarpet::Render::Base
      # Methods where the first argument is the text content
      [
        # block-level calls
        :block_code, :block_quote, :block_html,

        # span-level calls
        :autolink, :codespan, :underline, :raw_html,
        :triple_emphasis, :strikethrough, :superscript,
        :highlight, :quote,

        # footnotes
        :footnotes, :footnote_def, :footnote_ref,

        # low level rendering
        :entity
      ].each do |method|
        define_method method do |*args|
          args.first
        end
      end

      def initialize(document, spacing, leading)
        super()
        @document = document
        @spacing = spacing
        @leading = leading
        @next_pad = 0
      end

      def emphasis(text)
        "<i>" + text + "</i>"
      end

      def double_emphasis(text)
        "<b>" + text + "</b>"
      end

      def triple_emphasis(text)
        text
      end

      # Other methods where we don't return only a specific argument
      def link(link, _title, content)
        "#{content} (#{link})"
      end

      def list(content, list_type)
        case list_type
        when :ordered
          ordered_list = content.split("[step]").select(&:present?)
          label_width = ordered_list.length > 9 ? 17 : 12
          ordered_list.each_with_index do |text, index|
            list_item_render text, (index + 1).to_s + ".", label_width if text.present?
          end
        when :unordered
          content.split("[step]").each do |text|
            list_item_render text, "-" if text.present?
          end
        end
        @next_pad = 20
        ""
      end

      def list_item(text, _flags)
        "[step]#{text.strip}"
      end

      def list_item_render(text, label, label_width = 10)
        settings = {
          character_spacing: @spacing,
          leading: @leading,
          inline_format: TRUE
        }

        @document.indent(20, 0) do
          @document.float do
            @document.text "#{label} "
          end

          @document.indent(label_width, 0) do
            @document.text text.gsub("[step]", ""), settings
          end
        end
      end

      def paragraph(text)
        settings = {
          character_spacing: @spacing,
          leading: @leading,
          inline_format: TRUE
        }

        # since we pad by 10, the next header will only have top pad for 10 more to reach
        # a consistent padding of 20
        @next_pad = 10
        @document.pad_bottom(10) do
          @document.text text, settings
        end
        ""
      end

      def header(text, _header_level)
        # only pad the header if there is an item above it (otherwise we have a huge gap at the beginning)
        @document.pad_top(@next_pad) do
          settings = {
            style: :bold,
            character_spacing: @spacing,
            leading: 5,
            size: _header_level == 1 ? 13 : 10,
            inline_format: TRUE
          }
          @document.text text, settings
        end
        @next_pad = 20
        ""
      end
    end
  end
end
