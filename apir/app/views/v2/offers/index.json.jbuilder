# json.partial! 'pagination', pagination: $offers
json.set! :data do
  json.array! @offers[1...2] do |offer|
    json.partial! 'v2/offers/offer', offer: offer
  end
end
