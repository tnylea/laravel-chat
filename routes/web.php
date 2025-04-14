<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Chat API routes - protected by auth middleware
    Route::prefix('api')->middleware(['auth'])->group(function () {
        Route::get('messages', [\App\Http\Controllers\MessageController::class, 'index']);
        Route::post('messages', [\App\Http\Controllers\MessageController::class, 'store']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
