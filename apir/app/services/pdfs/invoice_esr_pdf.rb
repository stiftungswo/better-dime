# frozen_string_literal: true

require "prawn"
require "prawn/measurement_extensions"

module Pdfs
  class InvoiceEsrPdf
    include Prawn::View
    include Pdfs::PrawnHelper
    include ActionView::Helpers::NumberHelper

    def initialize(global_setting, invoice)
      @global_setting = global_setting
      @invoice = invoice
      @spacing = 0.25

      draw
    end

    def document
      @document ||= Prawn::Document.new(page_size: "A4", page_layout: :portrait, margin: [0, 0, 0, 0])
    end

    def format_money_esr(amount)
      number_to_currency(amount, unit: "", separator: " ", delimiter: "")
    end

    def format_money(amount)
      number_to_currency(amount, unit: "", separator: ".", delimiter: ",").tr(",", "'")
    end

    def draw
      draw_recipient_left
      draw_sender_left
      draw_price(0.2.cm)
      draw_account_nr_left

      draw_recipient_center
      draw_price(6.3.cm)
      draw_account_nr_center

      draw_ref_number
      draw_sender_right

      draw_info
    end

    def draw_recipient_left
      bounding_box([0.25.cm, 9.8.cm], width: 5.3.cm, height: 2.9.cm) do
        # stroke_bounds

        text @global_setting.sender_name, size: 9, style: :bold, character_spacing: @spacing
        text @global_setting.sender_street, size: 10, character_spacing: @spacing
        text @global_setting.sender_zip + " " + @global_setting.sender_city, size: 10, character_spacing: @spacing
      end
    end

    def draw_sender_left
      bounding_box([0.5.cm, 4.4.cm], width: 5.3.cm, height: 3.9.cm) do
        # stroke_bounds

        font_size = 9
        leading = 16.5 - font_size

        move_down 5
        text @invoice.customer.company.name, size: font_size, character_spacing: @spacing, leading: leading if @invoice.customer.company
        text @invoice.customer.full_name, size: font_size, character_spacing: @spacing, leading: leading
        text @invoice.address.street + ", " + @invoice.address.supplement, size: font_size, character_spacing: @spacing, leading: leading
        text @invoice.address.zip.to_s + " " + @invoice.address.city, size: font_size, character_spacing: @spacing, leading: leading
      end
    end

    def draw_price(left_offset)
      (0..0).each do |i|
        bounding_box([left_offset + 0.05.cm + i * 0.55.cm, 5.7.cm], width: 5.5.cm, height: 0.5.cm) do
          # uncomment the next line to see a debug view of the boxes provided by the esr
        end
      end

      (0..10).each do |i|
        bounding_box([left_offset + 0.05.cm + i * 0.51.cm, 5.55.cm], width: 0.4.cm, height: 0.5.cm) do
          # uncomment the next line to see a debug view of the boxes provided by the esr
          # stroke_bounds
        end
      end

      total = (@invoice.breakdown[:final_total] / 5.0).round * 5 / 100.0
      price_text = format_money_esr(total)
      col = 11 - price_text.length
      price_text.each_char do |c|
        float do
          draw_text c, size: 13, at: [left_offset + 0.25.cm - width_of(c) / 2 + col * 0.51.cm, 5.15.cm]
        end
        col += 1
      end
    end

    def draw_account_nr_left
      bounding_box([2.5.cm, 6.3.cm], width: 3.1.cm, height: 0.35.cm) do
        # stroke_bounds

        text @global_setting.sender_bank.to_s, size: 7.5, align: :right, valign: :center
      end
    end

    def draw_recipient_center
      bounding_box([6.35.cm, 9.8.cm], width: 5.3.cm, height: 2.9.cm) do
        # stroke_bounds

        text @global_setting.sender_name, size: 9, style: :bold, character_spacing: @spacing
        text @global_setting.sender_street, size: 10, character_spacing: @spacing
        text @global_setting.sender_zip + " " + @global_setting.sender_city, size: 10, character_spacing: @spacing
      end
    end

    def draw_account_nr_center
      bounding_box([8.6.cm, 6.3.cm], width: 3.1.cm, height: 0.35.cm) do
        # stroke_bounds

        text @global_setting.sender_bank.to_s, size: 7.5, align: :right, valign: :center
      end
    end

    def draw_ref_number
      (0..9).each do |i|
        (0..2).each do |j|
          bounding_box([12.45.cm + i * 0.51.cm, 9.8.cm - j * 0.6.cm], width: 0.4.cm, height: 0.5.cm) do
            # uncomment the next line to see a debug view of the boxes provided by the esr
            # stroke_bounds
          end
        end
      end

      row = 0
      col = 0
      (I18n.t(:invoice_nr_esr) + @invoice.id.to_s).each_char do |c|
        float do
          draw_text c, size: 11, character_spacing: 8.1, leading: 6, at: [12.65.cm - width_of(c) / 2 + col * 0.51.cm, 9.4.cm - row * 0.6.cm]
        end
        col += 1

        if col > 9
          col = 0
          row += 1
        end
      end
    end

    def draw_sender_right
      bounding_box([12.5.cm, 5.7.cm], width: 8.1.cm, height: 3.5.cm) do
        # stroke_bounds

        font_size = 9
        leading = 16.5 - font_size

        move_down 5
        text @invoice.customer.company.name, size: font_size, character_spacing: @spacing, leading: leading if @invoice.customer.company
        text @invoice.customer.full_name, size: font_size, character_spacing: @spacing, leading: leading
        text @invoice.address.street + ", " + @invoice.address.supplement, size: font_size, character_spacing: @spacing, leading: leading
        text @invoice.address.zip.to_s + " " + @invoice.address.city, size: font_size, character_spacing: @spacing, leading: leading
      end
    end

    def draw_info
      bounding_box([0.5.cm, 16.5.cm], width: 20.cm, height: 6.cm) do
        # stroke_bounds
        leading = 6

        text I18n.t(:bank_payment), size: 11, character_spacing: @spacing
        text I18n.t(:esr_description), size: 9, character_spacing: @spacing

        info_label_width = 4

        bounding_box([0.0.cm, 4.4.cm], width: info_label_width.cm, height: 4.cm) do
          # stroke_bounds

          text I18n.t(:finance_institute), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:in_favor_of), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:usage_esr), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:iban), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:bic), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:outstanding_amount), size: 9, character_spacing: @spacing, leading: leading
        end

        info_size = 8.7

        bounding_box([info_label_width.cm, 4.4.cm], width: (13.5.cm + (5.cm - info_label_width.cm)), height: 4.cm) do
          # stroke_bounds

          total = (@invoice.breakdown[:final_total] / 5.0).round * 5 / 100.0
          total_formated = format_money(total)

          text @global_setting.sender_bank_detail, size: info_size, character_spacing: @spacing, leading: leading
          text @global_setting.sender_name + ", " + @global_setting.sender_street +
               ", " + @global_setting.sender_zip + " " + @global_setting.sender_city, size: info_size, character_spacing: @spacing, leading: leading
          text I18n.t(:invoice_nr) + " " + @invoice.id.to_s, size: info_size, character_spacing: @spacing, leading: leading
          text @global_setting.sender_bank_iban, size: info_size, character_spacing: @spacing, leading: leading
          text @global_setting.sender_bank_bic, size: info_size, character_spacing: @spacing, leading: leading
          text "CHF " + total_formated, size: info_size, character_spacing: @spacing, leading: leading
        end
      end
    end
  end
end
