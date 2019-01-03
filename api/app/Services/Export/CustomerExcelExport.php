<?php

namespace App\Services\Export;

use App\Models\Customer\Customer;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class CustomerExcelExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping
{
    public function __construct(Collection $data)
    {
        $this->filteredCustomers = $data;
        $this->allCustomers = Customer::all();
    }

    public function collection()
    {
        return $this->filteredCustomers;
    }

    public function headings(): array
    {
        return [
            'Typ', 'Anrede', 'Name', 'Firma', 'Abteilung', 'E-Mail-Adresse', 'Telefonnummern', 'Postanschriften', 'Kommentar'
        ];
    }

    public function map($customer): array
    {
        return [
            $customer->type == 'person' ? 'Person' : 'Firma',
            $customer->salutation,
            !empty($customer->first_name) ? $customer->first_name . ' ' . $customer->last_name : null,
            empty($customer->name) ? empty($customer->company_id) ? null : $this->allCustomers->firstWhere('id', $customer->company_id)->name : $customer->name,
            $customer->department,
            $customer->email,
            $customer->phone_numbers->map(function (\App\Models\Customer\Phone $p) {
                return $p->number;
            })->implode(', '),
            $customer->addresses->map(function (\App\Models\Customer\Address $a) {
                return (string)$a;
            })->implode("\n"),
            $customer->comment
        ];
    }
}
