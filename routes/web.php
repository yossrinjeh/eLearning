<?php

use Illuminate\Support\Facades\Route;

// Leave empty but file must exist
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');