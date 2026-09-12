# frozen_string_literal: true

require "rails_helper"

RSpec.describe Pdfs::InvoiceQrBillPdf do
  let(:invoice) { create(:invoice) }

  # scor_reference/qrr_reference are private and only depend on @invoice, so build a bare
  # instance rather than going through the full QR-bill rendering pipeline (which additionally
  # needs a valid sender IBAN, cost group distributions, etc.).
  def reference_generator(invoice)
    pdf = described_class.allocate
    pdf.instance_variable_set(:@invoice, invoice)
    pdf
  end

  describe "#scor_reference" do
    it "is stable across renders when the invoice hasn't changed" do
      first = reference_generator(invoice).send(:scor_reference)
      second = reference_generator(invoice).send(:scor_reference)

      expect(first).to eq(second)
    end

    it "changes when the invoice itself is edited" do
      before_reference = reference_generator(invoice).send(:scor_reference)

      invoice.update!(description: "changed description")

      expect(reference_generator(invoice).send(:scor_reference)).not_to eq(before_reference)
    end

    it "changes when a position is added, even without editing the invoice's own fields" do
      before_reference = reference_generator(invoice).send(:scor_reference)

      create(:invoice_position, invoice: invoice)
      invoice.reload

      expect(reference_generator(invoice).send(:scor_reference)).not_to eq(before_reference)
    end

    it "zero-pads the invoice id to a fixed width" do
      # Without zero-padding, ids that are prefixes of one another (1, 10, 100, ...) print
      # identically in the first 4-character block of the grouped display (format_reference),
      # since the shared leading digit(s) land there and the rest spill into the next block -
      # not a data collision, but genuinely misleading on a printed QR-bill.
      reference = reference_generator(invoice).send(:scor_reference)

      expect(reference).to match(/\ARF\d{2}SWO\d{6}V[0-9a-f]{8}\z/)
    end
  end

  describe "#qrr_reference" do
    it "is exactly 27 numeric digits" do
      reference = reference_generator(invoice).send(:qrr_reference)

      expect(reference).to match(/\A\d{27}\z/)
    end

    it "changes when the invoice itself is edited" do
      before_reference = reference_generator(invoice).send(:qrr_reference)

      invoice.update!(description: "changed description")

      expect(reference_generator(invoice).send(:qrr_reference)).not_to eq(before_reference)
    end

    it "changes when a discount is added, even without editing the invoice's own fields" do
      before_reference = reference_generator(invoice).send(:qrr_reference)

      create(:invoice_discount, invoice: invoice)
      invoice.reload

      expect(reference_generator(invoice).send(:qrr_reference)).not_to eq(before_reference)
    end
  end
end
