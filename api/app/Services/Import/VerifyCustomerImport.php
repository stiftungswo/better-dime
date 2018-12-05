<?php

namespace App\Services\Import;

use App\Models\Customer\Customer;
use Maatwebsite\Excel\Facades\Excel;

class VerifyCustomerImport
{
    public static function convertAndCheckImportFile(string $pathOfExcelImportFile)
    {
        $allCustomers = Customer::all();
        $unsortedImportArray = Excel::toArray(new VerifyCustomerImport, $pathOfExcelImportFile, null, \Maatwebsite\Excel\Excel::XLSX);
        array_shift($unsortedImportArray[0]); // remove the heading row from the import

        $sortedCustomers = collect([]);

        foreach ($unsortedImportArray[0] as $unsortedCustomer) {
            $isCompany = $unsortedCustomer[0] == 'Firma';

            if ($isCompany) {
                $isDuplicate = $allCustomers->where('name', '=', $unsortedCustomer[4])
                    ->where('email', '=', $unsortedCustomer[6])->isNotEmpty();
                $isInvalid = empty($unsortedCustomer[4]);
            } else {
                $isDuplicate = $allCustomers->where('first_name', '=', $unsortedCustomer[2])
                    ->where('last_name', '=', $unsortedCustomer[3])
                    ->where('email', '=', $unsortedCustomer[6])->isNotEmpty();
                $isInvalid = empty($unsortedCustomer[2]) || empty($unsortedCustomer[3]);

                if (!empty($unsortedCustomer[4])) {
                    // check that a company with this name is existing, either in our database or previously added to the export
                    $isInvalid = $isInvalid ?: $allCustomers->where('type', '=', 'company')
                            ->where('name', '=', $unsortedCustomer[4])->isEmpty() &&
                        $sortedCustomers->where('type', '=', 'company')
                            ->where('name', '=', $unsortedCustomer[4])->isEmpty();
                }
            }

            // check that street, postcode and city are present for a new address
            if (!empty($unsortedCustomer[10]) || !empty($unsortedCustomer[12]) || !empty($unsortedCustomer[13])) {
                $isInvalid = $isInvalid ?: empty($unsortedCustomer[10]) || empty($unsortedCustomer[12]) || empty($unsortedCustomer[13]);
            }

            $sortedCustomers->push([
                'city' => $unsortedCustomer[13],
                'comment' => $unsortedCustomer[15],
                'name' => $unsortedCustomer[4],
                'country' => $unsortedCustomer[14],
                'department' => $unsortedCustomer[5],
                'duplicate' => $isDuplicate,
                'email' => $unsortedCustomer[6],
                'fax' => $unsortedCustomer[8],
                'first_name' => $unsortedCustomer[2],
                'invalid' => $isInvalid,
                'main_number' => $unsortedCustomer[7],
                'mobile_number' => $unsortedCustomer[9],
                'last_name' => $unsortedCustomer[3],
                'postcode' => $unsortedCustomer[12],
                'type' => $unsortedCustomer[0] == 'Firma' ? 'company' : 'person',
                'salutation' => $unsortedCustomer[1],
                'street' => $unsortedCustomer[10],
                'supplement' => $unsortedCustomer[11],
            ]);
        }

        return $sortedCustomers;
    }
}
