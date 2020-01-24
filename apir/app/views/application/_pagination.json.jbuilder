json.set! :current_page,	pagination.current_page
json.set! :first_page_url,	"/?page=1"
json.set! :last_page_url,	"/?page=#{pagination.total_pages}"
json.set! :last_page,	pagination.total_pages
json.set! :from, pagination.total_count
json.set! :next_page_url,	"/?page=#{pagination.next_page}"  # path_to_next_page(pagination)
json.set! :prev_page_url,	"/?page=#{pagination.prev_page}"  # path_to_prev_page(pagination)
json.set! :path,	"/"
json.set! :per_page, pagination.limit_value
json.set! :to, pagination.total_count
json.set! :total,	pagination.total_count
