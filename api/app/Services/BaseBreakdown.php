<?php

namespace App\Services;

class BaseBreakdown
{
    protected function throwExceptionIfNull($object1, $object2, string $property, $oldPropertyName = null)
    {
        if (is_null($oldPropertyName)) {
            $oldPropertyName = $property;
        }

        if (is_null($object1->$oldPropertyName)) {
            throw new \InvalidArgumentException('Cant create new entity because property ' . $oldPropertyName . ' is null.');
        } else {
            $object2->$property = $object1->$oldPropertyName;
        }
        return $object2;
    }
}
