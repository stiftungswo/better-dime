# frozen_string_literal: true

require "simplecov"
SimpleCov.start "rails" do
  add_filter "app/channels/application_cable/channel.rb"
  add_filter "app/channels/application_cable/connection.rb"
  add_filter "app/jobs/application_job.rb"
  add_filter "app/mailers/application_mailer.rb"
  add_filter "app/models/application_record.rb"
  add_filter "app/errors/"
  # don't test the excel/pdf outputs
  add_filter "app/services/pdfs/"
  add_filter "app/services/cost_group_report_service.rb"
  add_filter "app/services/customers_import_service.rb"
  add_filter "app/services/customers_xlsx_import_service.rb"
  add_filter "app/services/revenue_report_service.rb"
  add_filter "app/services/project_service_hour_report_service.rb"
  add_filter "app/services/project_category_service_hour_report_service.rb"
  add_filter "app/services/project_service_hour_report_service_split.rb"
  add_filter "app/services/project_comment_filter.rb"
  add_filter "app/services/project_effort_filter.rb"
  add_filter ".semaphore-cache"
end
SimpleCov.minimum_coverage 80

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
  config.filter_run_when_matching :focus
  config.example_status_persistence_file_path = "spec/examples.txt"
  config.disable_monkey_patching!
  config.default_formatter = "doc" if config.files_to_run.one?

  config.profile_examples = 10
  config.order = :random

  Kernel.srand config.seed
end
RSpec::Support::ObjectFormatter.default_instance.max_formatted_output_length = 10_000
