class ParamsModifier
  def self.copy_attributes(params, copy_from, copy_to)
    params[copy_to] = params[copy_from]
  end

  def self.destroy_missing(params, expected_collection, param_key)
    unless params[param_key].blank?
      # destroy items which were not passed along in the params
      expected_collection.each do |item|
        unless params[param_key].any? {|search_item| search_item[:id] == item.id }
          params[param_key].push({ id: item.id, _destroy: 1 })
        end
      end
    end
  end
end
