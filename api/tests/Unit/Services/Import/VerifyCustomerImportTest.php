<?php

namespace Tests\Unit\Services\Import;

use App\Models\Customer\Company;
use App\Models\Customer\Person;
use App\Services\Import\VerifyCustomerImport;
use Laravel\Lumen\Testing\DatabaseTransactions;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class VerifyCustomerImportTest extends \TestCase
{

    use DatabaseTransactions;

    public function testDuplicateCompany()
    {
        $company = factory(Company::class)->create();
        $spreadsheet = new Spreadsheet();
        $sheet = $this->createBaseDocument($spreadsheet, 'Firma');
        $sheet->setCellValue('E2', $company->name);
        $sheet->setCellValue('G2', $company->email);

        $customersArray = $this->writeAndLoadDocument($spreadsheet);
        $this->assertCount(1, $customersArray);
        $this->assertTrue($customersArray[0]['duplicate']);
        $this->deleteTemporaryFile();
    }

    public function testInvalidCompany()
    {
        $spreadsheet = new Spreadsheet();
        $this->createBaseDocument($spreadsheet, 'Firma');

        $customersArray = $this->writeAndLoadDocument($spreadsheet);
        $this->assertCount(1, $customersArray);
        $this->assertTrue($customersArray[0]['invalid']);
        $this->deleteTemporaryFile();
    }

    public function testDuplicatePerson()
    {
        $person = factory(Person::class)->create();
        $spreadsheet = new Spreadsheet();
        $sheet = $this->createBaseDocument($spreadsheet, 'Person');
        $sheet->setCellValue('C2', $person->first_name);
        $sheet->setCellValue('D2', $person->last_name);
        $sheet->setCellValue('G2', $person->email);

        $customersArray = $this->writeAndLoadDocument($spreadsheet);
        $this->assertCount(1, $customersArray);
        $this->assertTrue($customersArray[0]['duplicate']);
        $this->deleteTemporaryFile();
    }

    public function testInvalidPerson()
    {
        $spreadsheet = new Spreadsheet();
        $this->createBaseDocument($spreadsheet, 'Person');

        $customersArray = $this->writeAndLoadDocument($spreadsheet);
        $this->assertCount(1, $customersArray);
        $this->assertTrue($customersArray[0]['invalid']);
        $this->deleteTemporaryFile();
    }

    public function testInvalidAssociatedCompanyAtPerson()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $this->createBaseDocument($spreadsheet, 'Person');
        $sheet->setCellValue('C2', 'Hans');
        $sheet->setCellValue('D2', 'Heinrich');
        $sheet->setCellValue('E2', 'Schabdaubida AG');

        $customersArray = $this->writeAndLoadDocument($spreadsheet);
        $this->assertCount(1, $customersArray);
        $this->assertTrue($customersArray[0]['invalid']);
        $this->deleteTemporaryFile();
    }

    public function testInvalidAddress()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $this->createBaseDocument($spreadsheet, 'Person');
        $sheet->setCellValue('C2', 'Hans');
        $sheet->setCellValue('D2', 'Heinrich');
        $sheet->setCellValue('K2', 'Auergasse 2');

        $customersArray = $this->writeAndLoadDocument($spreadsheet);
        $this->assertCount(1, $customersArray);
        $this->assertTrue($customersArray[0]['invalid']);
        $this->deleteTemporaryFile();
    }

    public function testDataMapping()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $this->createBaseDocument($spreadsheet, 'Person');

        $companyTemplate = [
            'Firma', null, null, null, 'Stiftung Wirtschaft und Ökologie', null, 'office@stiftungswo.ch',
            '088 999 33 99', '088 999 33 98', null, 'Bahnstrasse 18b', null, 8603, 'Schwerzenbach',
            'Schweiz', 'Dies ist unsere Organisation.'
        ];

        $personTemplate = [
            'Person', 'Prof. Dr.', 'Hans', 'Heinrich', 'Stiftung Wirtschaft und Ökologie', 'IT', 'hh@stiftungswo.ch',
            null, null, '077 666 33 44', 'Winkelgasse', null, 8000, 'Zürich', 'Schweiz',
            'Hans Heinrich ist der MySQL Genius bei der SWO.'
        ];

        $sheet->fromArray($companyTemplate, null, 'A2');
        $sheet->fromArray($personTemplate, null, 'A3');

        $customersArray = $this->writeAndLoadDocument($spreadsheet)->toArray();
        $this->assertCount(2, $customersArray);
        $this->assertFalse($customersArray[0]['invalid']);
        $this->assertFalse($customersArray[1]['invalid']);
        
        // test down the person entity that everything is at its place
        $this->assertEquals($personTemplate[13], $customersArray[1]['city']);
        $this->assertEquals($personTemplate[15], $customersArray[1]['comment']);
        $this->assertEquals($personTemplate[4], $customersArray[1]['name']);
        $this->assertEquals($personTemplate[14], $customersArray[1]['country']);
        $this->assertEquals($personTemplate[5], $customersArray[1]['department']);
        $this->assertFalse($customersArray[1]['duplicate']);
        $this->assertEquals($personTemplate[6], $customersArray[1]['email']);
        $this->assertEquals($personTemplate[8], $customersArray[1]['fax']);
        $this->assertEquals($personTemplate[2], $customersArray[1]['first_name']);
        $this->assertEquals($personTemplate[7], $customersArray[1]['main_number']);
        $this->assertEquals($personTemplate[9], $customersArray[1]['mobile_number']);
        $this->assertEquals($personTemplate[3], $customersArray[1]['last_name']);
        $this->assertEquals($personTemplate[12], $customersArray[1]['postcode']);
        $this->assertEquals('person', $customersArray[1]['type']);
        $this->assertEquals($personTemplate[1], $customersArray[1]['salutation']);
        $this->assertEquals($personTemplate[10], $customersArray[1]['street']);
        $this->assertEquals($personTemplate[11], $customersArray[1]['supplement']);
        
        $this->deleteTemporaryFile();
    }

    private function createBaseDocument(Spreadsheet $spreadsheet, string $type)
    {
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->fromArray(['Typ (Firma oder Person)', 'Anrede', 'Vorname', 'Nachname', 'Firma',
            'Abteilung', 'E-Mail-Adresse', 'Hauptnummer', 'Fax', 'Mobiltelefonnummer',
            'Strasse', 'Addresszusatz', 'PLZ', 'Ort', 'Land', 'Kommentar'], null, 'A1');
        $sheet->setCellValue('A2', $type);
        return $sheet;
    }

    private function deleteTemporaryFile()
    {
        unlink(storage_path('app/customers.xlsx'));
    }

    private function writeAndLoadDocument(Spreadsheet $spreadsheet)
    {
        $writer = new Xlsx($spreadsheet);
        $writer->save(storage_path('app/customers.xlsx'));
        return VerifyCustomerImport::convertAndCheckImportFile('customers.xlsx');
    }
}
