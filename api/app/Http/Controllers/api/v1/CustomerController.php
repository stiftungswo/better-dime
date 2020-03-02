<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\Customer;
use App\Services\Creator\CreateCustomersFromImport;
use App\Services\Export\CustomerExcelExport;
use App\Services\Export\CustomerExcelImportTemplate;
use App\Services\Filter\CustomerFilter;
use App\Services\Import\VerifyCustomerImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends BaseController
{
    public function export(Request $request)
    {
        $validatedData = $this->validate($request, [
            'customer_tags' => 'string',
            'export_format' => 'required|integer',
            'include_hidden' => 'required|integer',
        ]);

        $customerData = CustomerFilter::fetch($validatedData);

        switch ($validatedData['export_format']) {
            case 1:
                return response(join(';', $customerData->map(function ($c) {
                    return $c->email;
                })->toArray()));
            case 2:
                return Excel::download(new CustomerExcelExport($customerData), 'customers.xlsx');
            default:
                return null;
        }
    }

    public function importTemplate()
    {
        return Excel::download(new CustomerExcelImportTemplate, 'import_template.xlsx');
    }

    public function index()
    {
        return Customer::all();
    }

    public function get($id)
    {
        $customer = Customer::with(['addresses'])->findOrFail($id);
        $response = $customer->toArray();
        if ($customer->type === "person" && $customer->company) {
            $response['addresses'] = $customer->addresses->merge($customer->company->addresses);
        }
        return $response;
    }

    public function doImport(Request $request)
    {
        // Note: Data gets verified during the verifyImport step. So if street is set, it will always have a zip and a city at least
        $validatedData = $this->validate($request, [
            'customer_tags' => 'array',
            'customer_tags.*' => 'integer',
            'customers_to_import' => 'array|required',
            'customers_to_import.*.city' => 'string|nullable',
            'customers_to_import.*.comment' => 'string|nullable',
            'customers_to_import.*.name' => 'string|nullable',
            'customers_to_import.*.country' => 'string|nullable',
            'customers_to_import.*.department' => 'string|nullable',
            'customers_to_import.*.email' => 'string|nullable',
            'customers_to_import.*.fax' => 'string|nullable',
            'customers_to_import.*.first_name' => 'string|nullable',
            'customers_to_import.*.main_number' => 'string|nullable',
            'customers_to_import.*.mobile_number' => 'string|nullable',
            'customers_to_import.*.last_name' => 'string|nullable',
            'customers_to_import.*.zip' => 'integer|nullable',
            'customers_to_import.*.type' => 'string|required',
            'customers_to_import.*.salutation' => 'string|nullable',
            'customers_to_import.*.street' => 'string|nullable',
            'customers_to_import.*.supplement' => 'string|nullable',
            'hidden' => 'boolean|required',
            'rate_group_id' => 'integer|required'
        ]);

        try {
            CreateCustomersFromImport::create($validatedData['rate_group_id'], $validatedData['hidden'], $validatedData['customers_to_import'], $validatedData['customer_tags']);
            return "Customers imported!";
        } catch (\Exception $e) {
            return response('Unable to import customers: ' . $e->getMessage(), 500);
        }
    }

    public function verifyImport(Request $request)
    {
        if ($request->hasFile('importFile')) {
            $pathOfFile = $request->file('importFile')->store('customer_imports');
            return VerifyCustomerImport::convertAndCheckImportFile($pathOfFile);
        } else {
            return response('You did not upload a valid file', 400);
        }
    }
}
