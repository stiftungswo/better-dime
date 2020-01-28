# json.partial! 'pagination', pagination: $offers
json.partial! 'pagination', pagination: @offers
json.set! :data do
  json.array! @offers do |offer|
    json.partial! 'v2/offers/offer', offer: offer.decorate
  end
end
