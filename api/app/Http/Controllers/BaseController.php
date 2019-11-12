<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Laravel\Lumen\Routing\Controller;

class BaseController extends Controller
{
    /**
     * Pass a model (with the attribute archived) to archive it.
     * @param Model $model
     * @param Request $request
     * @return string
     * @throws \Illuminate\Validation\ValidationException;
     */
    protected function doArchive(Model $model, Request $request)
    {
        $validatedData = $this->validate($request, [
            'archived' => 'required|boolean'
        ]);

        $model->archived = $validatedData['archived'];
        $model->save();
        return 'Entity ' . $validatedData['archived'] ? 'archived' : 'restored';
    }

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

    /**
     * Extracts the pagination parameters (current page num, page size etc..) from the request.
     *
     * @param Request $request The request with which the api point was accessed
     * @param $pageNum stores the current page number in this variable (passed by reference)
     * @param $pageSize stores the page size in this variable (passed by reference)
     */
    private function extractPaginationParameters(Request $request, &$pageNum, &$pageSize){
        $pageNum = $request->query('page', null);
        $pageSize = $request->query('pageSize', null);

        if($pageNum != null && $pageSize != null){
            if(!ctype_digit($pageNum))
                $pageNum = 1;
            if(!ctype_digit($pageSize))
                $pageSize = 10;
        }else{
            $pageNum = null;
            $pageSize = null;
        }
    }

    /**
     * Returns the query's contents either in paginated form (if it detects pagination parameters) or without
     * pagination (if no pagination parameters or incomplete parameters are passed)
     *
     * @param Builder $query The query which is supposed to be paginated
     * @param Request $request The request with which the api point was accessed
     * @param null $postProcess optional post processing function which modifies the collection before paginating
     * @return array|LengthAwarePaginator the return result
     */
    protected function getPaginatedQuery(Builder $query, Request $request, $postProcess = null){
        $this->extractPaginationParameters($request, $pageNum, $pageSize);

        $totalCount = $query->count();

        if($postProcess == null){
            $postProcess = function (\Illuminate\Database\Eloquent\Collection $q){return $q->all();};
        }

        if($pageNum == null || $pageSize == null){
            return $postProcess($query->get());
        }else{
            $projectData = $query->skip(($pageNum-1)*$pageSize)->take($pageSize)->orderBy('updated_at', 'desc')->get();
            return new LengthAwarePaginator($postProcess($projectData), $totalCount, $pageSize, $pageNum);
        }
    }
}
