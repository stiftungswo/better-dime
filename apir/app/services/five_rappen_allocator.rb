# frozen_string_literal: true

# Rounds amounts (in Rappen) to multiples of 5 so that they add up exactly to a given target, using the largest
# remainder method. This keeps printed lines consistent with the printed total.
class FiveRappenAllocator
  def self.allocate(values, target)
    steps = values.map { |v| v / 5.0 }
    floors = steps.map(&:floor)
    adjust(floors, steps, (target / 5.0).round - floors.sum).map { |f| f * 5 }
  end

  # Hands out (or takes back) the missing steps, starting with the largest remainders
  def self.adjust(floors, steps, missing)
    ranked = steps.each_index.sort_by { |i| [floors[i] - steps[i], i] }
    chosen = missing.positive? ? ranked.first(missing) : ranked.reverse.first(-missing)
    chosen.each { |i| floors[i] += missing <=> 0 }
    floors
  end
  private_class_method :adjust
end
