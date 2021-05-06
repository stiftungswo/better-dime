# frozen_string_literal: true

require "prawn"
require "prawn/measurement_extensions"
require 'qr-bills'
require 'qr-bills/qr-exceptions'
require 'qr-bills/qr-params'
require 'qr-bills/qr-html-layout'
require 'qr-bills/qr-creditor-reference'

module Pdfs
  class InvoiceQrBillPdf
    include Prawn::View
    include Pdfs::PrawnHelper
    include ActionView::Helpers::NumberHelper

    def initialize(global_setting, invoice)
      @global_setting = global_setting
      @invoice = invoice
      @spacing = 0.25

      draw
    end

    def filename
      "QR-Rechnung_" + @invoice.id.to_s + "_" + @invoice.name.split(",")[0].split(";")[0] + "_" + @invoice.ending.strftime("%Y_%m_%d")
    end

    def document
      @document ||= Prawn::Document.new(page_size: "A4", page_layout: :portrait, margin: [0, 0, 0, 0])
    end

    def format_money_qr_bill(amount)
      number_to_currency(amount, unit: "", separator: ".", delimiter: " ")
    end

    def format_money(amount)
      number_to_currency(amount, unit: "", separator: ".", delimiter: "'")
    end

    def draw
      generate_qr

      draw_receipt
      draw_payment_part

      draw_info

      File.delete(@bill[:params][:qrcode_filepath])
    end

    def generate_qr
      params = QRBills.get_qr_params

      params[:bill_type]                                      = "red_without_reference"
      params[:qrcode_filepath]                                = "#{Dir.pwd}/tmp/qrcode-#{@invoice.id.to_s}.png"
      params[:output_params][:format]                         = "qrcode_png"
      params[:bill_params][:creditor][:iban]                  = "CH27 3000 0002 8000 4067 9"
      params[:bill_params][:creditor][:address][:type]        = "S"
      params[:bill_params][:creditor][:address][:name]        = @global_setting.sender_name
      params[:bill_params][:creditor][:address][:line1]       = @global_setting.sender_street
      params[:bill_params][:creditor][:address][:postal_code] = @global_setting.sender_zip.to_s
      params[:bill_params][:creditor][:address][:town]        = @global_setting.sender_city
      params[:bill_params][:creditor][:address][:country]     = "CH"
      params[:bill_params][:amount]                           = (@invoice.breakdown[:final_total] / 5.0).round * 5 / 100.0
      params[:bill_params][:currency]                         = "CHF"
      params[:bill_params][:debtor][:address][:type]          = "S"
      if @invoice.customer.company
        params[:bill_params][:debtor][:address][:name]          = @invoice.customer.company.name
        params[:bill_params][:debtor][:address][:line1]         = @invoice.customer.full_name
      else
        params[:bill_params][:debtor][:address][:name]          = @invoice.customer.full_name
      end
      params[:bill_params][:debtor][:address][:line2]         = @invoice.address.street
      params[:bill_params][:debtor][:address][:postal_code]   = @invoice.address.zip.to_s
      params[:bill_params][:debtor][:address][:town]          = @invoice.address.city

      params[:bill_params][:reference_type]                   = "NON"
      params[:bill_params][:additionally_information]         = I18n.t(:invoice_nr_esr) + @invoice.id.to_s

      @bill = QRBills.generate(params)
    end





    def draw_receipt
      bounding_box([0.cm, 10.5.cm], width: 6.2.cm, height: 10.5.cm) do
        stroke_bounds

        bounding_box([0.5.cm, 10.cm], width: 5.2.cm, height: 0.7.cm) do
          #Title section
          text I18n.t(:receipt), size: 11, style: :bold
        end

        bounding_box([0.5.cm, 9.3.cm], width: 5.2.cm, height: 5.6.cm) do
          #Information section
          font_size = 8
          leading = 9 - font_size

          text I18n.t(:payable_to), size: 6, style: :bold, leading: 3
          text "CH27 3000 0002 8000 4067 9", size: font_size, leading: leading
          text @global_setting.sender_name, size: font_size, leading: leading
          text @global_setting.sender_street, size: font_size, leading: leading
          text @global_setting.sender_zip + " " + @global_setting.sender_city, size: font_size, leading: leading

          move_down 9

          supplement = @invoice.address.supplement.blank? ? "" : ", " + @invoice.address.supplement

          text I18n.t(:payable_by), size: 6, style: :bold, leading: 3
          text @invoice.customer.company.name, size: font_size, leading: leading if @invoice.customer.company
          text @invoice.customer.full_name, size: font_size, leading: leading
          text @invoice.address.street + supplement, size: font_size, leading: leading
          text @invoice.address.zip.to_s + " " + @invoice.address.city, size: font_size, leading: leading
        end

        bounding_box([0.5.cm, 3.7.cm], width: 5.2.cm, height: 1.4.cm) do
          #Amount section
          bounding_box([0.cm, 1.4.cm], width: 2.6.cm, height: 1.4.cm) do
            text I18n.t(:currency), size: 6, style: :bold, leading: 3
            text "CHF", size: font_size, leading: 3
          end
          bounding_box([2.6.cm, 1.4.cm], width: 2.6.cm, height: 1.4.cm) do
            text I18n.t(:amount), size: 6, style: :bold, leading: 3
            text format_money_qr_bill((@invoice.breakdown[:final_total] / 5.0).round * 5 / 100.0), size: font_size, leading: 3
          end
        end

        bounding_box([0.5.cm, 2.3.cm], width: 5.2.cm, height: 1.8.cm) do
          #Acceptance point section
          text I18n.t(:acceptance_point), size: 6, style: :bold, leading: 2, align: :right
        end
      end
    end

    def draw_payment_part
      font_size = 10
      leading = 11- font_size
      h_font_size = 8
      h_leading = 11 - h_font_size

      bounding_box([6.2.cm, 10.5.cm], width: 14.8.cm, height: 10.5.cm) do
        stroke_bounds

        bounding_box([0.5.cm, 10.cm], width: 5.1.cm, height: 0.7.cm) do
          #Title section
          text I18n.t(:payment_part), size: 11, style: :bold
        end

        bounding_box([0.5.cm, 8.8.cm], width: 4.6.cm, height: 4.6.cm) do
          #Swiss QR Code section
          image @bill[:params][:qrcode_filepath], width: 4.6.cm
        end

        bounding_box([0.5.cm, 3.7.cm], width: 5.1.cm, height: 2.2.cm) do
          #Amount section
          bounding_box([0.cm, 2.2.cm], width: 2.5.cm, height: 2.2.cm) do
            text I18n.t(:currency), size: h_font_size, style: :bold, leading: h_leading
            text "CHF", size: 10, leading: 3
          end
          bounding_box([2.5.cm, 2.2.cm], width: 2.6.cm, height: 2.2.cm) do
            text I18n.t(:amount), size: h_font_size, style: :bold, leading: h_leading
            text format_money_qr_bill((@invoice.breakdown[:final_total] / 5.0).round * 5 / 100.0), size: 10, leading: 3
          end
        end

        bounding_box([5.6.cm, 10.cm], width: 8.7.cm, height: 8.5.cm) do
          #Information section
          text I18n.t(:payable_to), size: h_font_size, style: :bold, leading: h_leading
          text "CH27 3000 0002 8000 4067 9", size: font_size, leading: leading
          text @global_setting.sender_name, size: font_size, leading: leading
          text @global_setting.sender_street, size: font_size, leading: leading
          text @global_setting.sender_zip + " " + @global_setting.sender_city, size: font_size, leading: leading

          move_down 11

          text I18n.t(:additional_information), size: h_font_size, style: :bold, leading: h_leading
          text I18n.t(:invoice_nr_esr) + @invoice.id.to_s, size: font_size, leading: leading

          move_down 11

          supplement = @invoice.address.supplement.blank? ? "" : ", " + @invoice.address.supplement

          text I18n.t(:payable_by), size: h_font_size, style: :bold, leading: h_leading
          text @invoice.customer.company.name, size: font_size, leading: leading if @invoice.customer.company
          text @invoice.customer.full_name, size: font_size, leading: leading
          text @invoice.address.street + supplement, size: font_size, leading: leading
          text @invoice.address.zip.to_s + " " + @invoice.address.city, size: font_size, leading: leading
        end
      end
    end

    def draw_info
      bounding_box([0.5.cm, 16.5.cm], width: 20.cm, height: 6.cm) do
        #stroke_bounds
        leading = 6

        text I18n.t(:bank_payment), size: 11, character_spacing: @spacing
        text I18n.t(:esr_description), size: 9, character_spacing: @spacing

        info_label_width = 4

        bounding_box([0.0.cm, 4.4.cm], width: info_label_width.cm, height: 4.cm) do
          #stroke_bounds

          text I18n.t(:finance_institute), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:in_favor_of), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:usage_esr), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:iban), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:bic), size: 9, character_spacing: @spacing, leading: leading
          text I18n.t(:outstanding_amount), size: 9, character_spacing: @spacing, leading: leading
        end

        info_size = 8.7

        bounding_box([info_label_width.cm, 4.4.cm], width: (13.5.cm + (5.cm - info_label_width.cm)), height: 4.cm) do
          #stroke_bounds

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
