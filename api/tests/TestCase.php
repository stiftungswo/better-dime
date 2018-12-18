<?php

use App\Models\Employee\Employee;

abstract class TestCase extends Laravel\Lumen\Testing\TestCase
{
    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__ . '/../bootstrap/app.php';
    }

    public function asAdmin()
    {
        $user = factory(Employee::class)->create([
            "is_admin" => true
        ]);
        return $this->actingAs($user);
    }

    public function asUser()
    {
        $user = factory(Employee::class)->create([
            "is_admin" => false
        ]);
        return $this->actingAs($user);
    }

    public function responseToArray()
    {
        return json_decode($this->response->getContent(), true);
    }

    public function assertResponseMatchesTemplate(array $template = [], $ignoreMetadata = false)
    {
        if (!is_array($this->responseToArray())) {
            throw new \PHPUnit\Framework\ExpectationFailedException('Response is not an Array. This usually means that Lumen sent an HTML response because an internal error occurred.');
        } else {
            $this->disassembleArray($template, $ignoreMetadata);
        }
    }

    private function disassembleArray(array $toDisassemble, bool $ignoreMetaData)
    {
        foreach ($toDisassemble as $key => $value) {
            $this->checkKeyValue($key, $value, $toDisassemble, $ignoreMetaData);
        }
    }

    private function checkKeyValue($key, $value, $currentControlledArray, bool $ignoreMetaData)
    {
        if (is_array($value)) {
            $this->disassembleArray($value, $ignoreMetaData);
        } else {
            if (!($ignoreMetaData && in_array($key, ['id', 'created_at', 'updated_at', 'deleted_at', 'created_by', 'updated_by', 'deleted_by']))) {
                $this->assertArraySubset([$key => $value], $currentControlledArray, 'Unable to find ' . $key . ' in Response.');
            }
        }
    }
}
