# frozen_string_literal: true

module Pdfs
  module Generators
    class MailHeaderGenerator
      def initialize(document, global_setting, data, date = Time.current.to_date, accountant = nil)
        @document = document
        @global_setting = global_setting
        @data = data
        @date = date
        @address_offset = 40
        @logo_width = 150
        @logo_simple_width = 65
        @logo_height = 64
        @swo_blue = "007DC2"
        @page_offset = 30
        @title_widths = { effort_report: 190, invoice: 112, offer: 84, project_report: 162 }
        @accountant = accountant
      end

      def draw(text_settings, draw_recipient = true)
        @default_text_settings = text_settings

        draw_logo
        draw_footer
        draw_sender_address
        draw_recipient_address if draw_recipient
      end

      def draw_misc(invoice, project, offer, accountant, costgroups, title_symbol, name, timespan = nil)
        @document.text "#{I18n.t(:date_name)} #{@date.strftime("%d.%m.%Y")}", @default_text_settings.merge(size: 8)
        @document.text "#{I18n.t(:vat)} Nr. #{@global_setting.sender_vat}", @default_text_settings.merge(size: 8) if costgroups
        # @document.draw_text 'Schwerzenbach, ' + @date.strftime("%d.%m.%Y"), @default_text_settings.merge(at: [@document.bounds.width - 145, @document.cursor], size: 8)
        @document.move_down 11
        @document.text name, @default_text_settings.merge(size: 12, style: :bold, color: @swo_blue)
        @document.move_down 11

        unless title_symbol === :project_report
          space = 72
          @document.draw_text "#{I18n.t(:offer)} Nr.", @default_text_settings.merge(at: [0, @document.cursor])
          @document.draw_text "#{I18n.t(:project)} Nr.", @default_text_settings.merge(at: [space, @document.cursor]) unless title_symbol === :offer
          @document.draw_text "#{I18n.t(:invoice)} Nr.", @default_text_settings.merge(at: [space * 2, @document.cursor]) unless title_symbol === :offer
          @document.draw_text I18n.t(:cost_groups), @default_text_settings.merge(at: [(space * 3) + 10, @document.cursor]) if costgroups
          @document.draw_text I18n.t(:clerk), @default_text_settings.merge(at: [@document.bounds.width - 175, @document.cursor])

          @document.move_down 16

          @document.draw_text offer.id.to_s, @default_text_settings.merge(at: [0, @document.cursor]) if offer
          @document.draw_text project.id.to_s, @default_text_settings.merge(at: [space, @document.cursor]) if project
          @document.draw_text invoice.id.to_s, @default_text_settings.merge(at: [space * 2, @document.cursor]) if invoice
          @document.draw_text costgroups, @default_text_settings.merge(at: [(space * 3) + 10, @document.cursor]) if costgroups
          @document.draw_text accountant.full_name, @default_text_settings.merge(at: [@document.bounds.width - 175, @document.cursor]) if accountant

          @document.move_down 26

          @document.draw_text I18n.t(:effort_period), @default_text_settings.merge(at: [0, @document.cursor]) if timespan

          @document.move_down 16

          @document.draw_text timespan, @default_text_settings.merge(at: [0, @document.cursor]) if timespan
        end
      end

      def draw_title(title_symbol)
        @document.bounding_box([0, @document.bounds.height + @page_offset], width: 200, height: 100) do
          # @document.stroke_bounds

          @document.fill_color @swo_blue
          @document.fill_rectangle [0, @document.bounds.height + 16], @title_widths[title_symbol], 36
          @document.fill_color "ffffff"
          @document.move_up 7
          @document.indent(4, 0) do
            @document.text I18n.t(title_symbol), @default_text_settings.merge(size: 20, style: :bold)
          end
          @document.fill_color "000000"
        end
      end

      private

      def draw_logo
        @document.repeat(:all) do
          @document.bounding_box([@document.bounds.width - @logo_width, @document.bounds.height + @page_offset], width: @logo_width, height: @logo_height) do
            # @document.stroke_bounds

            image_path = Rails.root.join("app", "assets", "logo", "logo_full_new.png")

            @document.move_up 15
            @document.image image_path, width: @logo_width
          end
        end
      end

      def draw_footer
        @document.repeat(:all) do
          @document.bounding_box([@document.bounds.left, @document.bounds.bottom], width: 200, height: 113) do
            # @document.stroke_bounds

            @document.transparent(0.5) do
              @document.draw_text @global_setting.sender_street, @default_text_settings.merge(at: [0, 94])
              @document.draw_text "CH-#{@global_setting.sender_zip} #{@global_setting.sender_city}", @default_text_settings.merge(at: [0, 81])
              @document.fill_color "007DC2"
              @document.draw_text "T ", @default_text_settings.merge(at: [0, 68], style: :bold)
              @document.fill_color "000000"
              @document.draw_text "#{@global_setting.sender_phone} ", @default_text_settings.merge(at: [9, 68])
              @document.draw_text "|", at: [71, 70], size: 7
              @document.fill_color "007DC2"
              @document.draw_text " E ", @default_text_settings.merge(at: [76, 68], style: :bold)
              @document.fill_color "000000"
              @document.draw_text @global_setting.sender_mail, @default_text_settings.merge(at: [87, 68])
            end
          end
        end
      end

      def draw_sender_address
        @document.bounding_box([0, @document.bounds.height - @address_offset], width: 200, height: 100) do
          # @document.stroke_bounds

          @document.text @global_setting.sender_name, @default_text_settings.merge(size: 10, leading: 6)
          @document.text @global_setting.sender_street, @default_text_settings.merge(size: 10, leading: 6)
          @document.text "#{@global_setting.sender_zip} #{@global_setting.sender_city}", @default_text_settings.merge(size: 10, leading: 6)
          @document.text @global_setting.sender_phone, @default_text_settings.merge(size: 10, leading: 6)
          @document.text @accountant.email, @default_text_settings.merge(size: 10, leading: 20) if @accountant&.email
          @document.text @global_setting.sender_mail, @default_text_settings.merge(size: 10, leading: 20) unless @accountant&.email
        end
      end

      def draw_recipient_address
        # don't specify a height to ensure that everything lands on the same page
        @document.bounding_box([@document.bounds.width - 175, @document.bounds.height - @address_offset], width: 175) do
          # @document.stroke_bounds

          @document.text @data.customer.company.name, @default_text_settings.merge(size: 10, leading: 6) if @data.customer.company.present?
          @document.text @data.customer.department, @default_text_settings.merge(size: 10, leading: 6) if @data.customer.department.present?
          @document.text "#{@data.customer.salutation || ""} #{@data.customer.full_name}", @default_text_settings.merge(size: 10, leading: 6)
          # use text_box to avoid line-wrapping long addresses
          @document.text_box @data.address.street, @default_text_settings.merge(size: 10, leading: 6, overflow: :shrink_to_fit, at: [0, @document.cursor], height: 12)
          @document.move_down 16
          @document.text @data.address.supplement, @default_text_settings.merge(size: 10, leading: 6) if @data.address.supplement.present?
          @document.text_box "#{@data.address.zip} #{@data.address.city}", @default_text_settings.merge(size: 10, leading: 6, overflow: :shrink_to_fit, at: [0, @document.cursor], height: 12)
        end
      end
    end
  end
end
