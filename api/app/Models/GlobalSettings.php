<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GlobalSettings extends Model
{
    protected $fillable = ['sender_name', 'sender_street', 'sender_zip', 'sender_city', 'sender_phone', 'sender_mail', 'sender_vat', 'sender_bank', 'sender_web', 'service_order_comment'];
}
