# frozen_string_literal: true

require "rails_helper"

RSpec.describe ParamsModifier do
  it "marks items for destruction if not present in params" do
    params = {
      my_items: [
        { id: 0 },
        { id: 1 },
        { id: 3 },
        { id: 4 }
      ]
    }

    class MyItem
      @id = 0

      def initialize(item_id)
        @id = item_id
      end

      attr_reader :id
    end

    expected_collection = [
      MyItem.new(0),
      MyItem.new(1),
      MyItem.new(2),
      MyItem.new(3),
      MyItem.new(4)
    ]

    expected_result = {
      my_items: [
        { id: 0 },
        { id: 1 },
        { id: 2, _destroy: 1 }, # expect ParamsModifier's destroy_missing to recognize missing elements and mark them for destruction
        { id: 3 },
        { id: 4 }
      ]
    }

    described_class.destroy_missing(params, expected_collection, :my_items)

    # sort the items so they have the same order in the array (otherwise array equality can fail due to different orderings)
    params[:my_items].sort_by! { |item| item[:id] }
    expected_result[:my_items].sort_by! { |item| item[:id] }

    expect(params).to eq(expected_result)
  end

  it "copies params" do
    params = {
      my_items: [
        { id: 0 },
        { id: 1 },
        { id: 3 },
        { id: 4 }
      ]
    }

    expected_result = {
      my_items: [
        { id: 0 },
        { id: 1 },
        { id: 3 },
        { id: 4 }
      ],
      copy_location: [
        { id: 0 },
        { id: 1 },
        { id: 3 },
        { id: 4 }
      ]
    }

    described_class.copy_attributes(params, :my_items, :copy_location)

    expect(params).to eq(expected_result)
  end
end
