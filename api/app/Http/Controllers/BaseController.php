<?php

namespace App\Http\Controllers;

use Illuminate\Support\Collection;
use Laravel\Lumen\Routing\Controller;

class BaseController extends Controller
{
    /**
     * allows to update a nested property of an object
     *
     * @param array $arrayOfNestedAttributes
     * @param Collection $currentElements
     * @param string $nestedAttributeClass
     * @param string $relationName
     * @param int $idOfParentElement
     * @throws \Exception
     */
    protected function executeNestedUpdate(array $arrayOfNestedAttributes, Collection $currentElements, string $nestedAttributeClass, string $relationName, int $idOfParentElement)
    {
        $updatedElements = [];

        foreach ($arrayOfNestedAttributes as $nestedAttribute) {
            if (!array_has($nestedAttribute, 'id')) {
                //insert
                $r = $nestedAttributeClass::make($nestedAttribute);
                $r->$relationName = $idOfParentElement;
                $r->save();
            } elseif ($currentElements->contains($nestedAttribute['id'])) {
                //edit
                $updatedElements[] = $nestedAttribute['id'];
                $nestedAttributeClass::findOrFail($nestedAttribute['id'])->update($nestedAttribute);
            } else {
                throw new \Exception("Das Objekt mit der ID " . $nestedAttribute['id'] . " und dem Typ " . $nestedAttributeClass . ' existiert nicht.');
            }
        }

        $deletedElements = $currentElements->diff($updatedElements);
        foreach ($deletedElements as $deleted) {
            $nestedAttributeClass::destroy($deleted);
        }
    }
}
