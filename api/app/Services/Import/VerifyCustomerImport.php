<?php

namespace App\Services\Import;

use App\Models\Customer\Customer;
use Maatwebsite\Excel\Facades\Excel;

class VerifyCustomerImport
{
    public static function importFileToSortedArray(string $pathOfExcelImportFile)
    {
        $allCustomers = Customer::all();
        $unsortedImportArray = Excel::toArray(new VerifyCustomerImport, $pathOfExcelImportFile, null, \Maatwebsite\Excel\Excel::XLSX);

        $sortedCustomers = [];

        foreach ($unsortedImportArray[0] as $unsortedCustomer) {
            $isCompany = $unsortedCustomer[0] == 'Firma';

            if ($isCompany) {
                $isDuplicate = $allCustomers->where('name', '=', $unsortedCustomer[4])
                    ->where('email', '=', $unsortedCustomer[6])->isNotEmpty();
            } else {
                $isDuplicate = $allCustomers->where('first_name', '=', $unsortedCustomer[2])
                    ->where('last_name', '=', $unsortedCustomer[3])
                    ->where('email', '=', $unsortedCustomer[6])->isNotEmpty();
            }

            array_push($sortedCustomers, [
                'city' => $unsortedCustomer[13],
                'comment' => $unsortedCustomer[15],
                'company_name' => $unsortedCustomer[4],
                'country' => $unsortedCustomer[14],
                'department' => $unsortedCustomer[5],
                'duplicate' => $isDuplicate,
                'email' => $unsortedCustomer[6],
                'fax' => $unsortedCustomer[8],
                'first_name' => $unsortedCustomer[2],
                'main_number' => $unsortedCustomer[7],
                'mobile_number' => $unsortedCustomer[9],
                'last_name' => $unsortedCustomer[3],
                'plz' => $unsortedCustomer[12],
                'type' => $unsortedCustomer[0] == 'Firma' ? 'company' : 'person',
                'salutation' => $unsortedCustomer[1],
                'street' => $unsortedCustomer[10],
                'supplement' => $unsortedCustomer[11],
            ]);
        }

        return $sortedCustomers;
    }
}
