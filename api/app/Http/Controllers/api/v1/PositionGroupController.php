<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\PositionGroup\PositionGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class PositionGroupController extends BaseController
{

    public function index(Request $request)
    {
        $query = $this->getFilteredQuery(PositionGroup::query(), $request, ['name']);
        return $query->get();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $positionGroup = PositionGroup::create(Input::toArray());
        return self::get($positionGroup->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        PositionGroup::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function get($id)
    {
        return PositionGroup::findOrFail($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
        ]);
    }
}
