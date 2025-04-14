<?php

namespace App\Http\Controllers;

use App\Events\NewMessage;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Get all messages.
     */
    public function index(): JsonResponse
    {
        $messages = Message::with('user:id,name')
            ->orderBy('created_at', 'asc')
            ->take(50)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'user' => [
                        'id' => $message->user->id,
                        'name' => $message->user->name,
                    ],
                    'created_at' => $message->created_at->diffForHumans(),
                ];
            });

        return response()->json($messages);
    }

    /**
     * Store a new message.
     */
    public function store(Request $request): JsonResponse
    {
        // Validate the request
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);
        
        // Ensure the user is authenticated
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        // Create the message with the authenticated user's ID
        $message = Auth::user()->messages()->create([
            'content' => $request->content,
        ]);

        $message->load('user:id,name');

        $messageData = [
            'id' => $message->id,
            'content' => $message->content,
            'user' => [
                'id' => $message->user->id,
                'name' => $message->user->name,
            ],
            'created_at' => $message->created_at->diffForHumans(),
        ];

        // Broadcast to all users including the sender for consistent behavior
        broadcast(new NewMessage($messageData));

        return response()->json($messageData, 201);
    }
}
