# frozen_string_literal: true

# BigDecimal serializes to JSON as a string by default to avoid precision loss.
# Our decimal columns (vat, value, factor, fixed_price, etc.) are all within
# Float's 15-digit precision, so serializing as Float is safe and produces
# proper JSON numbers instead of strings.
BigDecimal.class_eval do
  def as_json(_options = nil)
    to_f
  end
end
