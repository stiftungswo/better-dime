class CustomersXlsxImportService
  CUSTOMER_ROW = {
    type: "Typ (Firma|Person)",
    name: "Firmenname",
    salutation: "Anrede Person",
    first_name: "Vorname Person",
    last_name: "Nachname Person",
    comment: "Kommentar",
    department: "Abteilung",
    email: "Email",
  }.invert
  PHONES_ROW = {
    phones_1: "Hauptnummer",
    phones_2: "Mobile",
    phones_4: "Fax",
  }.invert
  ADDRESS_ROW = {
    street: "Strasse",
    supplement: "Zusatz",
    zip: "Postleitzahl",
    city: "Ort",
    country: "Land",
    description: "Beschreibung",
  }.invert
  RATE_GROUP_ROW = {
    rate_group_name: "Tarifgruppe"
  }.invert
  CUSTOMER_TAG_ROW = {
    customer_tag_name: "Tag"
  }.invert
  ROW = CUSTOMER_ROW.merge(PHONES_ROW).merge(ADDRESS_ROW).merge(RATE_GROUP_ROW).merge(CUSTOMER_TAG_ROW)

  TYPE_ROW = {
    "Firma" => "company",
    "Person" => "person",
  }
  TYPE_CLASS = {
    "company" => Company,
    "person" => Person,
  }

  attr_accessor :path, :xlsx, :sheet, :rows, :headers, :rate_groups, :customer_tags

  def initialize(path: )
    self.xlsx = Creek::Book.new(path, check_file_extension: false)
    self.sheet = xlsx.sheets[0]
    self.rows = sheet.simple_rows.to_a[1..]
    self.headers = sheet.simple_rows.to_a[0]
    self.rate_groups = RateGroup.all
    self.customer_tags = CustomerTag.all
  end

  def customers
    rows.map do |row|
      row = row.transform_keys {|key| headers[key] || key }
      customer_attributes = row.select {|name,_| CUSTOMER_ROW[name]}.transform_keys {|name| CUSTOMER_ROW[name]}
      customer_attributes[:type] = TYPE_ROW[customer_attributes[:type]] || customer_attributes[:type]

      customer_attributes[:rate_group_id] = rate_groups.find {|rate_group| rate_group.name == row[RATE_GROUP_ROW.invert[:rate_group_name]]}&.id
      customer_attributes[:customer_tag_ids] = customer_tags.select {|customer_tag| customer_tag.name == row[CUSTOMER_TAG_ROW.invert[:customer_tag_name]]}.map(&:id)

      phones_attributes = row.select {|name, number| PHONES_ROW[name] && number.present?}.transform_keys {|name| PHONES_ROW[name]}
      phones_attributes = phones_attributes.map {|(key,value)| {number: value, category: key.to_s[/\d\z/].to_i}}
      customer_attributes[:phones_attributes] = phones_attributes

      address_attributes = row.select {|name,_| ADDRESS_ROW[name]}.transform_keys {|name| ADDRESS_ROW[name]}
      address_attributes[:zip] = address_attributes[:zip]&.to_i
      customer_attributes[:addresses_attributes] = [address_attributes]

      customer = Customer.new customer_attributes
      customer.validate
      customer
    end
  end
end
