<?php

namespace App\Services\Export;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class CustomerExcelImportTemplate implements FromArray, ShouldAutoSize
{
    public function array(): array
    {
        return [
            [
                'Typ (Firma oder Person)', 'Anrede', 'Vorname', 'Nachname', 'Firma', 'Abteilung',
                'Abteilung', 'E-Mail-Adresse', 'Hauptnummer', 'Fax', 'Mobiltelefonnummer',
                'Strasse', 'Addresszusatz', 'PLZ', 'Ort', 'Land', 'Kommentar'
            ]
        ];
    }
}
