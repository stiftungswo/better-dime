<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Laravel\Lumen\Routing\Controller;

class BaseController extends Controller
{
    /**
     * Duplicates an object.
     * Pass an optional array to copy some of the relations.
     * Or pass an optional array to exclude some attributes from cloning.
     * Or pass an optional array to overwrite some attributes from the duplicate.
     *
     * @param Model $model
     * @param array $relations
     * @param array $except
     * @param array $newAttributes
     * @return integer
     */
    protected function duplicateObject(Model $model, array $relations = [], array $except = [], array $newAttributes = [])
    {
        $className = get_class($model);

        $duplicate = $model->replicate($except);
        unset($duplicate->relations);
        foreach ($newAttributes as $attribute => $value) {
            $duplicate->$attribute = $value;
        }
        $duplicate->save();

        $model->refresh();
        foreach ($relations as $key => $value) {
            if (is_string($key)) {
                $relation = $key;
                $relationName = $value;
            } else {
                $relation = $value;
                $relationName = snake_case(class_basename($className));
            }

            $model->$relation->each(function ($p) use ($duplicate, $relationName) {
                $duplicateP = $p->replicate();
                $duplicateP->$relationName()->associate($duplicate);
                $duplicateP->save();
            });
        }

        return $duplicate->id;
    }

    /**
     * allows to update a nested property of an object
     *
     * @param array $arrayOfNestedAttributes
     * @param Collection $currentElements
     * @param string $nestedAttributeClass
     * @param string $relationName
     * @param Model $parentElement
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
