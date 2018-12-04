<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\Customer;
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

    public function verifyImport(Request $request)
    {
        $request->hasFile('importFile');
        if ($request->file('importFile')->isValid()) {
            $pathOfFile = $request->file('importFile')->store('customer_imports');

            return VerifyCustomerImport::importFileToSortedArray($pathOfFile);
        };
    }
}
