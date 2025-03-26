# frozen_string_literal: true

require "prawn"

module Pdfs
  class OfferPdf < SignaturePdf
    def initialize(global_setting, offer, date, city)
      @global_setting = global_setting
      @offer = offer
      @date = date
      super(city || data_holder.location_id)
    end

    def project
      @project = Project.find_by(offer_id: data.id)
    end

    def invoice
      @invoice = Invoice.find_by(project_id: project.id) if project
    end

    def filename
      "Offerte_#{@offer.id}_#{@offer.name.split(",")[0].split(";")[0]}_#{@offer.created_at.strftime("%Y_%m_%d")}"
    end

    def data
      @offer
    end

    def draw
      header = Pdfs::Generators::MailHeaderGenerator.new(document, @global_setting, @offer, @date, @offer.accountant)

      header.draw(@default_text_settings, true)
      header.draw_title(:offer)

      draw_description(header)
      draw_breakdown
      draw_signature(I18n.t(:signature_contractor), I18n.t(:signature_client))
    end

    def draw_description(header)
      move_down 90

      header.draw_misc(nil, nil, data, data.accountant, nil, :offer, data.name)

      Redcarpet::Markdown.new(Pdfs::Markdown::PdfRenderer.new(document, @spacing, @leading))
                         .render((@offer.description[0] == "#" ? "" : "##{I18n.t(:project_description)}\n") + @offer.description)
    end

    def draw_breakdown
      Pdfs::Generators::BreakdownTableGenerator.new(document, @offer.breakdown).render(
        [I18n.t(:position), I18n.t(:price_per_unit_chf), I18n.t(:unit), I18n.t(:quantity), I18n.t(:vat), I18n.t(:subtotal_chf_excl_vat)]
      )

      move_down 20
    end
  end
end
