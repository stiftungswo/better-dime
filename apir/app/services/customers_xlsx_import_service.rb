class CustomersXlsxImportService
  attr_accessor :path, :xlsx, :sheet, :rows, :headers

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
    rate_group: "Tarifgruppe"
  }.invert
  ROW = CUSTOMER_ROW.merge(PHONES_ROW).merge(ADDRESS_ROW).merge(RATE_GROUP_ROW)

  TYPE_ROW = {
    "Firma" => "company",
    "Person" => "person",
  }
  TYPE_CLASS = {
    "company" => Company,
    "person" => Person,
  }

  def initialize(path: )
    self.xlsx = Creek::Book.new(path, check_file_extension: false)
    self.sheet = xlsx.sheets[0]
    self.rows = sheet.simple_rows.to_a[1..]
    self.headers = sheet.simple_rows.to_a[0]
  end

  def rate_groups
    @rate_groups ||= RateGroup.all
  end

  def customers
    rows.map do |row|
      row = row.transform_keys {|key| headers[key] || key }
      customer_attributes = row.select {|name,_| CUSTOMER_ROW[name]}.transform_keys {|name| CUSTOMER_ROW[name]}
      customer_attributes[:type] = TYPE_ROW[customer_attributes[:type]] || customer_attributes[:type]

      rate_group_attributes = row.select {|name,_| RATE_GROUP_ROW[name]}.transform_keys {|name| RATE_GROUP_ROW[name]}
      customer_attributes[:rate_group] = rate_groups.find {|rate_group| rate_group.name == rate_group_attributes[:rate_group]}

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
