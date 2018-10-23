<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
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
    protected function executeNestedUpdate(array $arrayOfNestedAttributes, Collection $currentElements, string $nestedAttributeClass, string $relationName, Model $parentElement)
    {
        $updatedElements = [];

        foreach ($arrayOfNestedAttributes as $nestedAttribute) {
            if (!array_has($nestedAttribute, 'id')) {
                /** @var Model $r */
                $r = $nestedAttributeClass::make($nestedAttribute);
                // associate works for polymorphic as well as "normal" belongsTo
                $r->$relationName()->associate($parentElement);
                $r->save();
            } elseif ($currentElements->contains($nestedAttribute['id'])) {
                //edit
                $updatedElements[] = $nestedAttribute['id'];
                $nestedAttributeClass::findOrFail($nestedAttribute['id'])->update($nestedAttribute);
            } else {
                throw new \Exception("Das Objekt mit der ID " . $nestedAttribute['id'] . " und dem Typ " . $nestedAttributeClass . ' existiert nicht.');
            }
        }

        $currentElementIds = $currentElements->map(function ($r) {
            return $r->id;
        });

        $deletedElements = $currentElementIds->diff($updatedElements);
        foreach ($deletedElements as $deleted) {
            $nestedAttributeClass::destroy($deleted);
        }
    }
}
