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

  describe "collision safety across different invoices" do
    # This is a multi-user app: two different invoices can genuinely be saved in the same
    # microsecond under concurrent load (a bulk operation, or just two employees saving at once).
    # update_column forces that exact coincidence deterministically instead of hoping a race
    # happens to reproduce it. The reference must still differ, because the invoice id is embedded
    # directly (fixed-width) rather than folded only into the hash - if it were only in the hash,
    # an identical updated_at would produce an identical hash and, without the id also being
    # embedded, an identical reference for two unrelated invoices.
    let(:other_invoice) { create(:invoice) }
    let(:shared_timestamp) { Time.zone.parse("2026-01-01 12:00:00.123456") }

    before do
      invoice.update_column(:updated_at, shared_timestamp) # rubocop:disable Rails/SkipsModelValidations
      other_invoice.update_column(:updated_at, shared_timestamp) # rubocop:disable Rails/SkipsModelValidations
    end

    it "produces different SCOR references for different invoices sharing the same updated_at" do
      reference_a = reference_generator(invoice).send(:scor_reference)
      reference_b = reference_generator(other_invoice).send(:scor_reference)

      expect(reference_a).not_to eq(reference_b)
    end

    it "produces different QRR references for different invoices sharing the same updated_at" do
      reference_a = reference_generator(invoice).send(:qrr_reference)
      reference_b = reference_generator(other_invoice).send(:qrr_reference)

      expect(reference_a).not_to eq(reference_b)
    end
  end

  describe "building number validation" do
    # Regression test for a real client complaint: the original guard combined both checks into
    # one generic message ("check settings and/or the invoice address"), leaving the user to guess
    # which of the two was actually broken. Each case now raises its own specific message.
    let(:global_setting) { create(:global_setting) }

    def missing_building_number_error(global_setting, invoice)
      described_class.new(global_setting, invoice, Time.zone.today)
      nil
    rescue ValidationError => error
      error
    end

    it "names the sender when the global settings building number is missing" do
      global_setting.update!(sender_street_number: nil)

      error = missing_building_number_error(global_setting, invoice)

      expect(error).not_to be_nil
      expect(error.human_readable_descriptions.join).to include("Absenders")
    end

    it "names the customer when the invoice address building number is missing" do
      invoice.address.update!(street_number: nil)

      error = missing_building_number_error(global_setting, invoice)

      expect(error).not_to be_nil
      expect(error.human_readable_descriptions.join).to include("Kunden")
    end
  end

  describe "known limitation: same invoice, same instant" do
    # Unlike the cross-invoice case above, this is NOT protected: the reference is a pure
    # function of (id, updated_at), so if the exact same invoice were somehow saved twice with an
    # identical updated_at, it would produce the identical reference both times - the edit
    # wouldn't "count". This is expected/documented rather than fixed: it requires the same
    # invoice to be written twice at the same microsecond, which - unlike two different invoices
    # merely overlapping under load - would mean two saves of one record resolved with no
    # observable time difference at all, not something normal concurrent usage produces.
    it "reuses the SCOR reference if the same invoice's updated_at is forced to repeat" do
      shared_timestamp = Time.zone.parse("2026-01-01 12:00:00.123456")
      invoice.update_column(:updated_at, shared_timestamp) # rubocop:disable Rails/SkipsModelValidations
      first = reference_generator(invoice).send(:scor_reference)

      invoice.update_column(:updated_at, shared_timestamp) # rubocop:disable Rails/SkipsModelValidations
      second = reference_generator(invoice).send(:scor_reference)

      expect(first).to eq(second)
    end

    it "reuses the QRR reference if the same invoice's updated_at is forced to repeat" do
      shared_timestamp = Time.zone.parse("2026-01-01 12:00:00.123456")
      invoice.update_column(:updated_at, shared_timestamp) # rubocop:disable Rails/SkipsModelValidations
      first = reference_generator(invoice).send(:qrr_reference)

      invoice.update_column(:updated_at, shared_timestamp) # rubocop:disable Rails/SkipsModelValidations
      second = reference_generator(invoice).send(:qrr_reference)

      expect(first).to eq(second)
    end
  end
end
